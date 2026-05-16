const { ResponseFormatter } = require("../utils/response");
const { ValidationError } = require("../utils/errors");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    // Build structured per-field details so the frontend can map errors to form fields
    const details = error.details.map((detail) => ({
      field: detail.path[0],
      path: detail.path,
      message: detail.message.replace(/['"]/g, ""),
    }));

    const primaryMessage = details.length === 1
      ? details[0].message
      : "Validation failed";

    const ve = new ValidationError(primaryMessage, details);
    return ResponseFormatter.error(res, ve, 400);
  }

  req.body = value;
  next();
};

module.exports = validate;
