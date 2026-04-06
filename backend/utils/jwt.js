const jwt = require("jsonwebtoken");
const logger = require('./logger');

const generateUserToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_USER_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    logger.error("Error generating user token:", error);
    throw error;
  }
};

const verifyUserToken = (token) => {
  try {
    if (!process.env.JWT_USER_SECRET) {
      throw new Error('JWT_USER_SECRET not configured');
    }
    return jwt.verify(token, process.env.JWT_USER_SECRET);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

const generateAdminToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_ADMIN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    logger.error("Error generating admin token:", error);
    throw error;
  }
};

const verifyAdminToken = (token) => {
  try {
    if (!process.env.JWT_ADMIN_SECRET) {
      throw new Error('JWT_ADMIN_SECRET not configured');
    }
    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch (error) {
    throw new Error('Admin token verification failed');
  }
};

module.exports = {
  generateUserToken,
  verifyUserToken,
  generateAdminToken,
  verifyAdminToken,
};