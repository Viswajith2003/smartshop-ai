const {
  sendValidationError,
  sendSuccess,
  sendError,
} = require("../utils/response");

class BaseController {
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static validateRequest(schema, data) {
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw new ValidationError(messages, error.details);
    }

    return value;
  }

  static handleValidationError(res, error) {
    return sendValidationError(res, { error });
  }

  static handleSendSuccess(res, message, data = null, statusCode = 200) {
    return sendSuccess(res, message, data, statusCode);
  }

  static handleSendError(res, message, details = null, statusCode = 500) {
    return sendError(res, message, details, statusCode);
  }
}

module.exports = BaseController;
