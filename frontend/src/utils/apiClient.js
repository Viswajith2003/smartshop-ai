import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/app';

const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
  });
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  client.interceptors.response.use(
    (response) => response,
    (error) => {

      if (error.response?.status === 401) {
        clearTokens();
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

export const getAuthToken = () => localStorage.getItem(AUTH_CONFIG.tokenKey);
export const getUser = () => {
  const userData = localStorage.getItem(AUTH_CONFIG.userKey);
  return userData ? JSON.parse(userData) : null;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
  }
};



export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData));
  } else {
    localStorage.removeItem(AUTH_CONFIG.userKey);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.userKey);
};

const makeRequest = async (config) => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Request failed';
    throw new Error(message);
  }
};

export default makeRequest;