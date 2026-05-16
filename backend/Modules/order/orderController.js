const OrderService = require("./orderService");
const { ResponseFormatter } = require("../../utils/response");
const mailService = require("../../utils/mailService");

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const { shippingAddress, paymentMethod, couponCode, walletOtp } = req.body;
      const userId = req.user.id;
      
      const result = paymentMethod === "COD" 
        ? await OrderService.createCODOrder(userId, shippingAddress, couponCode)
        : paymentMethod === "Wallet"
          ? await OrderService.createWalletOrder(userId, shippingAddress, couponCode, walletOtp)
          : await OrderService.createRazorpayOrder(userId, shippingAddress, couponCode);

      const message = paymentMethod === "COD" 
        ? "COD order placed successfully" 
        : paymentMethod === "Wallet"
          ? "Wallet order placed successfully"
          : "Razorpay order created successfully";
      return ResponseFormatter.success(res, message, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async sendWalletOTP(req, res, next) {
    try {
      const user = await require("../../models/User").findById(req.user.id);
      if (!user) throw new Error("User not found");

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in user document
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // Log to console for development
      console.log(`\x1b[35m[OTP] Verification code for ${user.email}: \x1b[1m${otp}\x1b[0m`);
      
      // Send real email
      await mailService.sendOTP(user.email, otp);
      
      return ResponseFormatter.success(res, "Verification code sent successfully to your mail");
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req, res, next) {
    try {
      const order = await OrderService.verifyPayment(req.user.id, req.body);
      return ResponseFormatter.success(res, "Payment verified successfully", order);
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getUserOrders(req.user.id);
      return ResponseFormatter.success(res, "Orders fetched successfully", orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      return ResponseFormatter.success(res, "Order fetched successfully", order);
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await OrderService.cancelOrder(req.user.id, id, reason);
      return ResponseFormatter.success(res, "Order cancelled successfully", order);
    } catch (error) {
      next(error);
    }
  }

  static async returnOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await OrderService.returnOrder(req.user.id, id, reason);
      return ResponseFormatter.success(res, "Return requested and processed successfully", order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
