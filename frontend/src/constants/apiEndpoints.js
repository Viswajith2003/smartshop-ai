export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
  },
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id) => `/products/${id}`,
  },
  CART: {
    ADD: '/cart/add',
    GET: (userId) => `/cart/${userId}`,
    UPDATE: '/cart/update-quantity',
    DELETE: (userId, productId) => `/cart/${userId}/${productId}`,
  },
  COUPONS: {
    BASE: '/coupons',
    DETAIL: (id) => `/coupons/${id}`,
    APPLY: '/coupons/apply',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },
};
