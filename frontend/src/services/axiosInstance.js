import axios from 'axios';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../config/app';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
});

// Helper functions for token management
export const getAuthToken = () => localStorage.getItem('authToken');
export const getAdminToken = () => localStorage.getItem('adminToken');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
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

export const clearTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken() || getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
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
    }
    
    if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    }
    
    if (error.response?.status === 500 && !window.location.pathname.includes('/error')) {
      window.location.href = '/error';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
