const BaseController = require("./BaseController");
const { AuthService } = require("../services");
const Validation = require("../utils/validation");

class AuthController extends BaseController {
  static register = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.registerValidation,
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
      Validation.loginValidation,
      req.body,
    );
    const result = await AuthService.login(validatedData);
    BaseController.logAction("USER_LOGIN", result.user);
    BaseController.handleSendSuccess(res, "Login successful", result);
  });

  static changePassword = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.passwordChangeValidation,
      req.body,
    );
    await AuthService.changePassword(req.user._id, validatedData);
    BaseController.logAction("PSWD CHANGE", req.user);
    BaseController.handleSendSuccess(res, "Pswd changed successfully");
  });

  static logout = BaseController.asyncHandler(async (req, res) => {
    BaseController.logAction("USER_LOGOUT", req.user);
    BaseController.handleSendSuccess(res, "Logged out successfully");
  });

  static forgotPassword = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.forgotPasswordValidation,
      req.body,
    );
    const result = await AuthService.forgotPassword(validatedData.email);
    BaseController.handleSendSuccess(res, result.message, result);
  });

  static resetPassword = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.resetPasswordValidation,
      req.body,
    );
    const result = await AuthService.resetPassword(validatedData);
    BaseController.handleSendSuccess(res, result.message, result);
  });

  static verifyOtp = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.verifyOtpValidation,
      req.body,
    );
    const result = await AuthService.verifyOtp(validatedData);
    BaseController.handleSendSuccess(res, result.message, result);
  });

  static resendOtp = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.forgotPasswordValidation,
      req.body,
    );
    const result = await AuthService.resendOtp(validatedData.email);
    BaseController.handleSendSuccess(res, result.message, result);
  });

  static getProfile = BaseController.asyncHandler(async (req, res) => {
    BaseController.handleSendSuccess(res, "Profile fetched", req.user.getPublicProfile());
  });

  static updateProfile = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.profileUpdateValidation,
      req.body,
    );
    const result = await AuthService.updateProfile(req.user._id, validatedData);
    BaseController.handleSendSuccess(res, "Profile updated", result);
  });

  static updateAvatar = BaseController.asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }
    const result = await AuthService.updateAvatar(req.user._id, req.file.filename);
    BaseController.handleSendSuccess(res, "Avatar updated", result);
  });

  static addAddress = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      Validation.addressValidation,
      req.body,
    );
    const result = await AuthService.addAddress(req.user._id, validatedData);
    BaseController.handleSendSuccess(res, "Address added", result);
  });

  static updateAddress = BaseController.asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const validatedData = BaseController.validateRequest(
      Validation.addressValidation,
      req.body,
    );
    const result = await AuthService.updateAddress(req.user._id, addressId, validatedData);
    BaseController.handleSendSuccess(res, "Address updated", result);
  });

  static deleteAddress = BaseController.asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const result = await AuthService.deleteAddress(req.user._id, addressId);
    BaseController.handleSendSuccess(res, "Address deleted", result);
  });

  static setDefaultAddress = BaseController.asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const result = await AuthService.setDefaultAddress(req.user._id, addressId);
    BaseController.handleSendSuccess(res, "Default address updated", result);
  });
}

module.exports = AuthController;
