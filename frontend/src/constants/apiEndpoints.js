export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    RESEND_OTP: '/auth/resend-otp',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    CHANGE_PASSWORD: '/users/change-password',
    ADDRESS: '/users/address',
    ADDRESS_DETAIL: (id) => `/users/address/${id}`,
    ADDRESS_DEFAULT: (id) => `/users/address/${id}/default`,
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
  },
  CATEGORIES: {
    BASE: '/categories',
    DETAIL: (id) => `/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id) => `/products/${id}`,
  },
  CART: {
    ADD: '/cart/add',
    GET: '/cart',
    UPDATE: '/cart/update-quantity',
    TOGGLE_SELECTION: '/cart/toggle-selection',
    DELETE: (productId) => `/cart/${productId}`,
  },
  COUPONS: {
    BASE: '/coupons',
    DETAIL: (id) => `/coupons/${id}`,
    APPLY: '/coupons/apply',
  },
  ORDERS: {
    BASE: '/orders',
    CREATE: '/orders/create',
    VERIFY: '/orders/verify',
    CANCEL: (id) => `/orders/${id}/cancel`,
    RETURN: (id) => `/orders/${id}/return`,
    DETAIL: (id) => `/orders/${id}`,
    MY_ORDERS: '/orders/my-orders',
  },
  WISHLIST: {
    GET: '/wishlist',
    TOGGLE: '/wishlist/toggle',
    CLEAR: '/wishlist/clear',
  },
};
