const Joi = require("joi");

const adminLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("Processing", "Shipped", "Delivered", "Cancelled", "Returned").required(),
});

module.exports = {
  adminLoginSchema,
  updateOrderStatusSchema,
};
