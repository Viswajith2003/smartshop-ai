export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    
  }
};

export const AUTH_CONFIG = {
  tokenKey: 'authToken',
  userKey: 'user',
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};
