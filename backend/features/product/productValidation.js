const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().required().trim().min(10),
  price: Joi.number().required().min(0),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  stock: Joi.number().required().min(0),
  images: Joi.array().items(Joi.string()).min(1).required(),
  isActive: Joi.boolean().default(true),
  rating: Joi.number().min(0).max(5).default(0),
});

const productSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid("name", "price", "createdAt", "updatedAt", "rating").default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string().max(100).optional(),
  category: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
});

module.exports = {
  productSchema,
  productSearchSchema,
};
