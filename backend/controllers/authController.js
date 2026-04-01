const BaseController = require("./BaseController");
const { AuthService } = require("../services");
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation,
} = require("../utils/validation");

class AuthController extends BaseController {
  static register = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      registerValidation,
      req.body,
    );
    const result = await AuthService.register(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);
    BaseController.handleSendSuccess(
      res,
      "User registered successfully. Welcome!",
      result,
      201,
    );
  });

  static login = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      loginValidation,
      req.body,
    );
    const result = await AuthService.login(validatedData);
    BaseController.logAction("USER_LOGIN", result.user);
    BaseController.handleSendSuccess(res, "Login successful", result);
  });

  static changePassword = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      passwordChangeValidation,
      req.body,
    );
    await AuthService.changePassword(req.user._id, validatedData);
    BaseController.logAction("PSWD CHANGE", result.user);
    BaseController.handleSendSuccess(res, "Pswd changed successfully", result);
  });

  static logout = BaseController.asyncHandler(async (req, res) => {
    BaseController.logAction("USER_LOGOUT", req.user);
    BaseController.handleSendSuccess(res, "Logged out successfully");
  });
}

module.exports = AuthController;
