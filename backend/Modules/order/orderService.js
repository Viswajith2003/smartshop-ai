const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Payment = require("../../models/Payment");
const { NotFoundError, BadRequestError } = require("../../utils/errors");
const logger = require("../../utils/logger");
const PaymentService = require("../payment/paymentService");
const CouponService = require("../coupon/couponService");

class OrderService {
  static async createRazorpayOrder(userId, shippingAddress, couponCode = null) {
    const selectedItems = await this._getAndValidateCartItems(userId);
    const pricing = await this._calculatePricing(selectedItems, couponCode);

    try {
      const razorpayOrder = await PaymentService.createRazorpayOrder(pricing.totalPrice, `receipt_${Date.now()}`);
      
      const order = new Order({
        user: userId,
        items: selectedItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress,
        pricing
      });

      await order.save();
      await PaymentService.processPayment(userId, order._id, "Razorpay", pricing.totalPrice, {
        orderId: razorpayOrder.id
      });
      
      await this._updateStock(order.items, -1);

      return {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      };
    } catch (error) {
      logger.error(`Error creating Razorpay order: ${error.message}`);
      throw error;
    }
  }

  static async createWalletOrder(userId, shippingAddress, couponCode = null, walletOtp) {
    const selectedItems = await this._getAndValidateCartItems(userId);
    const pricing = await this._calculatePricing(selectedItems, couponCode);

    const user = await User.findById(userId);
    if (!user) throw new BadRequestError("User not found");
    
    // Verify OTP
    if (!user.otp || user.otp !== walletOtp) {
      throw new BadRequestError("Invalid verification code");
    }
    
    // Check expiry
    if (user.otpExpiry < Date.now()) {
      throw new BadRequestError("Verification code has expired");
    }

    if (user.wallet.balance < pricing.totalPrice) {
      throw new BadRequestError("Insufficient wallet balance");
    }

    const order = new Order({
      user: userId,
      items: selectedItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress,
      paymentStatus: "Completed",
      orderStatus: "Processing",
      pricing
    });

    await order.save();

    // Clear OTP after successful use
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    // Deduct from wallet
    user.wallet.balance -= pricing.totalPrice;
    user.wallet.transactions.push({
      amount: pricing.totalPrice,
      type: "debit",
      status: "success",
      description: `Payment for order ${order._id}`,
      orderId: order._id,
      createdAt: new Date()
    });
    await user.save();

    const payment = await Payment.create({
      user: userId,
      order: order._id,
      method: "Wallet",
      amount: pricing.totalPrice,
      status: "Completed",
      paidAt: Date.now()
    });

    order.payment = payment._id;
    await order.save();
    
    await this._updateStock(order.items, -1);
    await this._clearPurchasedItemsFromCart(userId, order.items);

    return order;
  }

  static async createCODOrder(userId, shippingAddress, couponCode = null) {
    const selectedItems = await this._getAndValidateCartItems(userId);
    const pricing = await this._calculatePricing(selectedItems, couponCode);

    const order = new Order({
      user: userId,
      items: selectedItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress,
      orderStatus: "Processing",
      pricing
    });

    await order.save();
    await PaymentService.processPayment(userId, order._id, "COD", pricing.totalPrice);
    
    await this._updateStock(order.items, -1);
    await this._clearPurchasedItemsFromCart(userId, order.items);

    return order;
  }

  static async verifyPayment(userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const isValid = await PaymentService.verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
    if (!isValid) throw new BadRequestError("Invalid payment signature");

    const payment = await Payment.findOne({ "razorpayDetails.orderId": razorpayOrderId });
    if (!payment) throw new NotFoundError("Payment record not found");

    const order = await Order.findById(payment.order);
    if (!order) throw new NotFoundError("Order not found");

    payment.status = "Completed";
    payment.razorpayDetails.paymentId = razorpayPaymentId;
    payment.razorpayDetails.signature = razorpaySignature;
    payment.paidAt = Date.now();
    await payment.save();

    order.paymentStatus = "Completed";
    order.orderStatus = "Processing";
    await order.save();

    await this._clearPurchasedItemsFromCart(userId, order.items);

    return order;
  }

  static async getUserOrders(userId) {
    return await Order.find({ user: userId })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });
  }

  static async getOrderById(orderId) {
    const order = await Order.findById(orderId).populate("items.product", "name images price");
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  static async cancelOrderItem(userId, orderId, itemId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError("Order not found");

    const item = order.items.id(itemId);
    if (!item) throw new NotFoundError("Item not found in order");

    if (item.itemStatus !== "Active") {
      throw new BadRequestError(`Cannot cancel item which is already ${item.itemStatus}`);
    }

    const uncancelableStatuses = ["Shipped", "Delivered", "Cancelled", "Returned", "Cancel Requested", "Return Requested"];
    if (uncancelableStatuses.includes(order.orderStatus)) {
      throw new BadRequestError(`Cannot cancel item in order which is ${order.orderStatus}`);
    }

    if (order.orderStatus === "Pending") {
      await this._updateStock([item], 1);
      item.itemStatus = "Cancelled";
      item.cancelReason = reason;

      const allInactive = order.items.every(i => i.itemStatus !== "Active");
      if (allInactive) {
        order.orderStatus = "Cancelled";
      }
      await order.save();
      return order;
    }

    await this._updateStock([item], 1);

    if (order.paymentStatus === "Completed") {
      const itemTotal = item.price * item.quantity;
      const refundAmount = order.pricing.subtotal > 0 
        ? itemTotal - (order.pricing.discount * (itemTotal / order.pricing.subtotal))
        : itemTotal;
      await this._refundToWallet(userId, refundAmount, orderId);
    }

    item.itemStatus = "Cancelled";
    item.cancelReason = reason;

    const allInactive = order.items.every(i => i.itemStatus !== "Active");
    if (allInactive) {
      order.orderStatus = "Cancelled";
      if (order.paymentStatus === "Completed") {
        order.paymentStatus = "Refunded";
        const Payment = require("../../models/Payment");
        await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
      }
    }

    await order.save();
    return order;
  }

  static async returnOrderItem(userId, orderId, itemId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError("Order not found");

    const item = order.items.id(itemId);
    if (!item) throw new NotFoundError("Item not found in order");

    if (item.itemStatus !== "Active") {
      throw new BadRequestError(`Cannot return item which is already ${item.itemStatus}`);
    }

    if (order.orderStatus !== "Delivered") {
      throw new BadRequestError("Only items from delivered orders can be returned");
    }

    item.itemStatus = "Returned";
    item.returnReason = reason;

    await this._updateStock([item], 1);

    const itemTotal = item.price * item.quantity;
    const refundAmount = order.pricing.subtotal > 0 
      ? itemTotal - (order.pricing.discount * (itemTotal / order.pricing.subtotal))
      : itemTotal;
    await this._refundToWallet(userId, refundAmount, orderId);

    const allInactive = order.items.every(i => i.itemStatus !== "Active");
    if (allInactive) {
      order.orderStatus = "Returned";
      order.paymentStatus = "Refunded";
      const Payment = require("../../models/Payment");
      await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
    }

    await order.save();
    return order;
  }

  static async cancelOrder(userId, orderId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError("Order not found");

    const uncancelableStatuses = ["Shipped", "Delivered", "Cancelled", "Returned", "Cancel Requested", "Return Requested"];
    if (uncancelableStatuses.includes(order.orderStatus)) {
      throw new BadRequestError(`Cannot cancel order which is already ${order.orderStatus}`);
    }

    if (order.orderStatus === "Pending") {
      await this._updateStock(order.items, 1);
      order.orderStatus = "Cancelled";
      order.cancelReason = reason;

      if (order.paymentStatus === "Completed") {
        let refundAmount = 0;
        const totalSubtotal = order.pricing.subtotal || 0;
        order.items.forEach(item => {
          if (item.itemStatus === "Active") {
            const itemTotal = item.price * item.quantity;
            const itemRefund = totalSubtotal > 0
              ? itemTotal - (order.pricing.discount * (itemTotal / totalSubtotal))
              : itemTotal;
            refundAmount += itemRefund;
          }
        });

        if (refundAmount > 0) {
          await this._refundToWallet(userId, refundAmount, orderId);
        }
        order.paymentStatus = "Refunded";
        await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
      }

      await order.save();
      return order;
    }

    order.orderStatus = "Cancel Requested";
    order.cancelReason = reason;
    await order.save();

    return order;
  }

  static async returnOrder(userId, orderId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError("Order not found");

    if (order.orderStatus !== "Delivered") {
      throw new BadRequestError("Only delivered orders can be returned");
    }

    order.orderStatus = "Return Requested";
    order.returnReason = reason;
    
    await order.save();

    return order;
  }

  // Private helpers (Rule 1)
  static async _getAndValidateCartItems(userId) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) throw new BadRequestError("Cart is empty");

    const selectedItems = cart.items.filter(item => item.isSelected);
    if (selectedItems.length === 0) throw new BadRequestError("No items selected for checkout");

    for (const item of selectedItems) {
      if (item.product.stock < item.quantity) {
        if (item.product.stock === 0) {
          throw new BadRequestError(`Product ${item.product.name} is out of stock`);
        } else {
          throw new BadRequestError(`Only ${item.product.stock} stock left for product ${item.product.name}`);
        }
      }
      if (!item.product.isActive) {
        throw new BadRequestError(`Product ${item.product.name} is currently unavailable`);
      }
    }
    return selectedItems;
  }

  static async _calculatePricing(items, couponCode = null) {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingPrice = 0;
    const taxPrice = 0;
    
    let discount = 0;
    if (couponCode) {
      try {
        const couponResult = await CouponService.applyCoupon(couponCode, subtotal);
        discount = couponResult.discountAmount;
      } catch (error) {
        // If a user sends a coupon code, it should be valid.
        throw error;
      }
    }

    const totalPrice = subtotal + shippingPrice + taxPrice - discount;

    return { subtotal, shippingPrice, taxPrice, discount, totalPrice, couponCode };
  }

  static async _updateStock(items, multiplier) {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product && product.isActive) {
        product.stock += multiplier * item.quantity;
        if (product.stock < 0) product.stock = 0;
        await product.save();
      } else {
        logger.info(`Skipped stock update for inactive/canceled product: ${item.product}`);
      }
    }
  }

  static async _clearPurchasedItemsFromCart(userId, items) {
    const purchasedProductIds = items.map(item => item.product.toString());
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(item => !purchasedProductIds.includes(item.product.toString()));
      cart.totalItems = cart.items.length;
      cart.totalPrice = cart.items.reduce((total, item) => total + (item.price || 0), 0);
      await cart.save();
    }
  }

  static async _refundToWallet(userId, amount, orderId) {
    await User.findByIdAndUpdate(userId, {
      $inc: { "wallet.balance": amount },
      $push: {
        "wallet.transactions": {
          amount,
          type: "credit",
          status: "success",
          description: `Refund for order ${orderId}`,
          orderId,
          createdAt: new Date()
        }
      }
    });
  }
}

module.exports = OrderService;
