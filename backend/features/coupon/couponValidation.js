const Joi = require("joi");

const couponSchema = Joi.object({
  code: Joi.string().required().trim().uppercase(),
  discountPercentage: Joi.number().min(0).max(100).required(),
  minPurchaseAmount: Joi.number().min(0).required(),
  maxDiscountAmount: Joi.number().min(0).required(),
  validFrom: Joi.date().required(),
  validUntil: Joi.date().required(),
  isActive: Joi.boolean().default(true),
  usageLimit: Joi.number().min(0).required(),
});

const applyCouponSchema = Joi.object({
  code: Joi.string().required().trim().uppercase(),
  totalPrice: Joi.number().required().min(0),
});

module.exports = {
  couponSchema,
  applyCouponSchema,
};
