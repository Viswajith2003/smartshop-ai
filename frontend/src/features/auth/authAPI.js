import axiosInstance from '../../services/axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await axiosInstance.put('/auth/profile/avatar', formData);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await axiosInstance.post('/auth/address', addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await axiosInstance.put(`/auth/address/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(`/auth/address/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await axiosInstance.patch(`/auth/address/${addressId}/default`);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData);
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
    return response.data;
  },

  verifyOtp: async (otpData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, otpData);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axiosInstance.post('/auth/resend-otp', { email });
    return response.data;
  }
};
