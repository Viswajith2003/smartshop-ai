const AuthService = require("./authService");
const { ResponseFormatter } = require("../../utils/response");

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return ResponseFormatter.success(res, "User registered successfully", result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return ResponseFormatter.success(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return ResponseFormatter.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req.body);
      return ResponseFormatter.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req, res, next) {
    try {
      const result = await AuthService.verifyOtp(req.body);
      return ResponseFormatter.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendOtp(email);
      return ResponseFormatter.success(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    return ResponseFormatter.success(res, "Logged out successfully");
  }
}

module.exports = AuthController;
