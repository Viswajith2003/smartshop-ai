const {
  sendValidationError,
  sendSuccess,
  sendError,
} = require("../utils/response");

const { ValidationError } = require("../utils/errors");

class BaseController {
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static validateRequest(schema, data) {
    if (!schema || typeof schema.validate !== 'function') {
      throw new Error(`Validation schema is missing or invalid. Received: ${typeof schema}`);
    }
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

  static handleSendSuccess(res, message, data = null, statusCode = 200, meta = null) {
    return sendSuccess(res, message, data, statusCode, meta);
  }

  static handleSendError(res, message, statusCode = 500, details = null) {
    return sendError(res, message, statusCode, details);
  }

  static logAction(action, user = null) {
    const logger = require("../utils/logger");
    const userEmail = user ? user.email : "System";
    logger.info(`User action - ${action} by user: ${userEmail}`);
  }
}

module.exports = BaseController;
