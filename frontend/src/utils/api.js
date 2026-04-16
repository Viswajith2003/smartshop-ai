import axios from 'axios';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../config/app';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
});

let authToken = null;
let adminToken = null;

const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

const getAdminToken = () => {
  if (!adminToken) {
    adminToken = localStorage.getItem('adminToken');
  }
  return adminToken;
};

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const setAdminToken = (token) => {
  adminToken = token;
  if (token) {
    localStorage.setItem('adminToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const clearTokens = () => {
  authToken = null;
  adminToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common['Authorization'];
};

export const getUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('user');
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken() || getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authEndpoints = ['/auth/login', '/auth/verify-otp', '/admin/login'];
      const isAuthEndpoint = error.config?.url && authEndpoints.some(endpoint => error.config.url.includes(endpoint));

      if (!isAuthEndpoint) {
        clearTokens();
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
    
    if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);



export const adminAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
};

export const categoryAPI = {
  getCategories: async () => {
    const response = await apiClient.get('/admin/categories');
    return response.data;
  },

  getCategory: async (id) => {
    const response = await apiClient.get(`/admin/categories/${id}`);
    return response.data;
  },

  addCategory: async (categoryData) => {
    const response = await apiClient.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  }
};

const initializeAuth = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

initializeAuth();

export default apiClient;