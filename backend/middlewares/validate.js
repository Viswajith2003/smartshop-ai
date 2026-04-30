const { ResponseFormatter } = require("../utils/response");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return ResponseFormatter.error(res, new Error(errorMessage), 400);
  }

  req.body = value;
  next();
};

module.exports = validate;
