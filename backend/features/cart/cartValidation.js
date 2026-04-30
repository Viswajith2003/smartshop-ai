const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
});

const updateQuantitySchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const toggleSelectionSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = {
  addToCartSchema,
  updateQuantitySchema,
  toggleSelectionSchema,
};
