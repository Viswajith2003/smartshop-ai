import apiClient, { clearTokens } from '../utils/api';

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
