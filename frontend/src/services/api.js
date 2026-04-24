import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const adminAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.LOGIN, credentials);
    return response.data;
  },
  getDashboard: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },
};

export const categoryAPI = {
  getCategories: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.CATEGORIES);
    return response.data;
  },
  getCategory: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`);
    return response.data;
  },
  addCategory: async (categoryData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.CATEGORIES, categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`);
    return response.data;
  }
};

export const productAPI = {
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PRODUCTS, { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
    return response.data;
  },
  addProduct: async (productData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.PRODUCTS, productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
    return response.data;
  }
};

export const cartAPI = {
  addToCart: async (cartData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, cartData);
    return response.data;
  },
  getCart: async (userId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET(userId));
    return response.data;
  },
  updateQuantity: async (cartData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, cartData);
    return response.data;
  },
  deleteCartItem: async (userId, productId) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.DELETE(userId, productId));
    return response.data;
  }
};

export const couponAPI = {
  getCoupons: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.COUPONS.BASE, { params });
    return response.data;
  },
  applyCoupon: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.COUPONS.APPLY, data);
    return response.data;
  }
};

export default {
  admin: adminAPI,
  category: categoryAPI,
  product: productAPI,
  cart: cartAPI,
  coupon: couponAPI,
};
