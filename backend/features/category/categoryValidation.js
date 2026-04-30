const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  description: Joi.string().optional().trim().min(2).max(200),
  isActive: Joi.boolean().default(true),
});

module.exports = {
  categorySchema,
};
