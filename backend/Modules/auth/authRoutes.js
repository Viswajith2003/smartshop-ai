const express = require("express");
const router = express.Router();
const AuthController = require("./authController");
const validate = require("../../middlewares/validate");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} = require("./authValidation");

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/resend-otp", validate(forgotPasswordSchema), AuthController.resendOtp);
router.post("/logout", AuthController.logout);

module.exports = router;
