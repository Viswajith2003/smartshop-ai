const Joi = require("joi");

const common = {
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  otp: Joi.string().length(6).required(),
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: common.email,
  password: common.password,
});

const loginSchema = Joi.object({
  email: common.email,
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: common.email,
});

const resetPasswordSchema = Joi.object({
  email: common.email,
  otp: common.otp,
  newPassword: common.password,
});

const verifyOtpSchema = Joi.object({
  email: common.email,
  otp: common.otp,
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
};
