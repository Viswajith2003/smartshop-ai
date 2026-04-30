const AdminService = require("./adminService");
const { ResponseFormatter } = require("../../utils/response");

class AdminController {
  static async login(req, res, next) {
    try {
      const result = await AdminService.login(req.body);
      return ResponseFormatter.success(res, "Admin login successful", result);
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req, res, next) {
    try {
      const stats = await AdminService.getDashboardStats();
      return ResponseFormatter.success(res, "Dashboard stats fetched", stats);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      return ResponseFormatter.success(res, "Users fetched successfully", users);
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const orders = await AdminService.getAllOrders();
      return ResponseFormatter.success(res, "Orders fetched successfully", orders);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await AdminService.updateOrderStatus(id, status);
      return ResponseFormatter.success(res, "Order status updated", order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
