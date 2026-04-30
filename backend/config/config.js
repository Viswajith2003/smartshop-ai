require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,

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

  CORS: {
    // Allowing both variations avoids common browser identification issues
    ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:5173", "http://127.0.0.1:5173"],
    CREDENTIALS: true,
    METHODS: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    ALLOWED_HEADERS: ["Content-Type", "Authorization", "X-Requested-With"]
  },

  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 1000,
    AUTH_MAX_REQUESTS: 50
  },
  
  MAIL: {
    SERVICE: process.env.MAIL_SERVICE || 'gmail',
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS
  },

  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
  }
};
