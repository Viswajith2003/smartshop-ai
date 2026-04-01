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
  delete apiClient.defaults.headers.common['Authorization'];
};
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
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
    const message = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'An error occurred';
    

    if (error.response?.status === 401) {
      clearTokens();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    

    if (error.response?.status === 403) {
      if (error.response?.data?.banned) {
        clearTokens();
        toast.error('Your account has been banned. Please contact support.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      toast.error('Access denied. Insufficient permissions.');
      return Promise.reject(error);
    }
    

    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
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
  
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },
  

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    clearTokens();
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