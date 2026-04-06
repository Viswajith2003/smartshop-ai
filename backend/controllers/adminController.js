const BaseController = require("./BaseController");
const AdminService = require("../services/AdminService");
const { loginValidation } = require("../utils/validation");

class AdminController extends BaseController {
  static login = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      loginValidation,
      req.body
    );
    const result = await AdminService.login(validatedData);
    BaseController.logAction("ADMIN_LOGIN", result.admin);
    BaseController.handleSendSuccess(res, "Admin login successful", result);
  });

  static getDashboardStats = BaseController.asyncHandler(async (req, res) => {
    const stats = await AdminService.getDashboardStats();
    BaseController.handleSendSuccess(res, "Dashboard stats fetched", stats);
  });
}

module.exports = AdminController;
