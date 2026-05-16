const Joi = require("joi");

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  bio: Joi.string().max(500).optional(),
});

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

const addressSchema = Joi.object({
  fullName: Joi.string().required().trim().min(2).max(100),
  phone: Joi.string().required().trim().pattern(/^\d{10}$/),
  street: Joi.string().required().trim().min(5).max(255),
  city: Joi.string().required().trim().min(2).max(100),
  district: Joi.string().required().trim().min(2).max(100),
  state: Joi.string().required().trim().min(2).max(100),
  pincode: Joi.string().required().trim().pattern(/^\d{6}$/),
  isDefault: Joi.boolean().default(false),
});

module.exports = {
  profileUpdateSchema,
  passwordChangeSchema,
  addressSchema,
};
