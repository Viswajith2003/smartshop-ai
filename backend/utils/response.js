const logger = require("./logger");
const { ErrorUtils } = require("./errors");

class ResponseFormatter {
  static success(res, message, data = null, statusCode = 200, meta = null) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    };

    if (data !== null) {
      response.data = data;
    }

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static error(res, error, statusCode = null) {
    const formattedError = ErrorUtils.formatError(error);
    const finalStatusCode = statusCode || formattedError.error.statusCode || 500;

    const response = {
      ...formattedError,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    };

    return res.status(finalStatusCode).json(response);
  }

  static validationError(res, validationResult) {
    const details = validationResult.error?.details || [];
    const errors = details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
      value: detail.context?.value,
    }));

    const response = {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: errors,
      },
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    };

    return res.status(400).json(response);
  }
}

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return ResponseFormatter.success(res, message, data, statusCode);
};

const sendError = (res, message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return ResponseFormatter.error(res, error, statusCode);
};

const sendValidationError = (res, validationResult) => {
  return ResponseFormatter.validationError(res, validationResult);
};

module.exports = {
  ResponseFormatter,
  sendSuccess,
  sendError,
  sendValidationError,
};
