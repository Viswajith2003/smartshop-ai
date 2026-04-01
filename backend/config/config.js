require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5002,

  MONGODB_URI: process.env.MONGO_URI ,

  NODE_ENV: process.env.NODE_ENV  || "development",

  JWT: {
    USER_SECRET:
      process.env.JWT_USER_SECRET || "your_super_secret_user_jwt_key",
    ADMIN_SECRET:
      process.env.JWT_ADMIN_SECRET || "your_super_secret_admin_jwt_key",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },


};
