const logger = require("../utils/logger");
const { sendError } = require("../utils/response");
const { verifyUserToken, verifyAdminToken } = require("../utils/jwt");
const User = require("../models/User");
const Admin = require("../models/Admin");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access token required", 401);
    }
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyUserToken(token);
    } catch (err) {
      return sendError(res, "Invalid or expired token", 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.status === "banned") {
      return sendError(res, "Your account has been banned", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("User authentication error:", error);
    return sendError(res, "Authentication failed", 401);
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Admin access token required", 401);
    }
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyAdminToken(token);
    } catch (err) {
      return sendError(res, "Invalid or expired admin token", 401);
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return sendError(res, "Admin not found", 404);
    }

    req.admin = admin;
    next();
  } catch (error) {
    logger.error("Admin authentication error:", error);
    return sendError(res, "Admin authentication failed", 401);
  }
};

module.exports = { authenticateUser, authenticateAdmin };