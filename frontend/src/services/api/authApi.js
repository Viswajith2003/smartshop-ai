import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const authApi = {
  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
  verifyOtp: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },
  resendOtp: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
    return response.data;
  },
};

export default authApi;
