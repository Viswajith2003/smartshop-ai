const Joi = require("joi");

const toggleWishlistSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = {
  toggleWishlistSchema,
};
