const PaymentService = require("./paymentService");
const { ResponseFormatter } = require("../../utils/response");

class PaymentController {
  static async getPaymentDetails(req, res, next) {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrder(orderId);
      return ResponseFormatter.success(res, "Payment details fetched successfully", payment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
