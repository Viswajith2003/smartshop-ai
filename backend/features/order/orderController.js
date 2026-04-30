const OrderService = require("./orderService");
const { ResponseFormatter } = require("../../utils/response");

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const { shippingAddress, paymentMethod, couponCode } = req.body;
      const userId = req.user.id;
      
      const result = paymentMethod === "COD" 
        ? await OrderService.createCODOrder(userId, shippingAddress, couponCode)
        : await OrderService.createRazorpayOrder(userId, shippingAddress, couponCode);

      const message = paymentMethod === "COD" ? "COD order placed successfully" : "Razorpay order created successfully";
      return ResponseFormatter.success(res, message, result, 201);
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
