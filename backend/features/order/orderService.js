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

    await this._updateStock(order.items, -1);
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

  static async cancelOrder(userId, orderId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError("Order not found");

    const uncancelableStatuses = ["Shipped", "Delivered", "Cancelled", "Returned"];
    if (uncancelableStatuses.includes(order.orderStatus)) {
      throw new BadRequestError(`Cannot cancel order which is already ${order.orderStatus}`);
    }

    await this._updateStock(order.items, 1);
    
    if (order.paymentStatus === "Completed") {
      await this._refundToWallet(userId, order.pricing.totalPrice, orderId);
      order.paymentStatus = "Refunded";
      await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
    }

    order.orderStatus = "Cancelled";
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

    order.orderStatus = "Returned";
    order.returnReason = reason;
    
    await this._updateStock(order.items, 1);
    await this._refundToWallet(userId, order.pricing.totalPrice, orderId);

    order.paymentStatus = "Refunded";
    await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
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
        throw new BadRequestError(`Product ${item.product.name} is out of stock`);
      }
    }
    return selectedItems;
  }

  static async _calculatePricing(items, couponCode = null) {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingPrice = subtotal > 5000 ? 0 : 500;
    const taxPrice = Math.round(subtotal * 0.18);
    
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
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: multiplier * item.quantity }
      });
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
