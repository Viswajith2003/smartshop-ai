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
      clearTokens();
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
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

export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  updateAvatar: async (formData) => {
    // Note: We don't manually set 'Content-Type': 'multipart/form-data' 
    // because Axios/Browser will set it correctly with the boundary.
    const response = await apiClient.put('/auth/profile/avatar', formData);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await apiClient.post('/auth/address', addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/auth/address/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/auth/address/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await apiClient.patch(`/auth/address/${addressId}/default`);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    clearTokens();
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  },

  verifyOtp: async (otpData) => {
    const response = await apiClient.post('/auth/verify-otp', otpData);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response.data;
  }
};

export const adminAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
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