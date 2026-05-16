const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../../models/Payment");
const Order = require("../../models/Order");
const config = require("../../config/config");
const logger = require("../../utils/logger");

const razorpay = new Razorpay({
  key_id: config.RAZORPAY.KEY_ID,
  key_secret: config.RAZORPAY.KEY_SECRET,
});

class PaymentService {
  static async createRazorpayOrder(amount, receipt) {
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: receipt,
    };

    try {
      return await razorpay.orders.create(options);
    } catch (error) {
      logger.error(`Razorpay order creation failed: ${error.message}`);
      throw error;
    }
  }

  static async verifyRazorpayPayment(paymentData) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === razorpaySignature;
  }

  static async processPayment(userId, orderId, method, amount, razorpayDetails = {}) {
    logger.info(`Processing payment for Order: ${orderId}, Method: ${method}`);

    const payment = new Payment({
      user: userId,
      order: orderId,
      method: method,
      amount: amount,
      status: "Pending",
      razorpayDetails,
      paidAt: null,
    });

    await payment.save();

    await Order.findByIdAndUpdate(orderId, {
      payment: payment._id,
      paymentStatus: payment.status
    });

    return payment;
  }

  static async getPaymentByOrder(orderId) {
    return await Payment.findOne({ order: orderId });
  }
}

module.exports = PaymentService;
