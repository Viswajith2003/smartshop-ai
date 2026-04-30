const Joi = require("joi");

const orderCreateSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    street: Joi.string().required().trim(),
    city: Joi.string().required().trim(),
    district: Joi.string().optional().allow("").trim(),
    state: Joi.string().required().trim(),
    pincode: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  }).required(),
  paymentMethod: Joi.string().valid("COD", "Razorpay").default("COD"),
  couponCode: Joi.string().optional().allow("", null),
});

const paymentVerifySchema = Joi.object({
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
});

const cancelReturnSchema = Joi.object({
  reason: Joi.string().required().min(5).max(500),
});

module.exports = {
  orderCreateSchema,
  paymentVerifySchema,
  cancelReturnSchema,
};
