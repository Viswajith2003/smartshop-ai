import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const userApi = {
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.PROFILE, data);
    return response.data;
  },
  updateAvatar: async (formData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  changePassword: async (data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
    return response.data;
  },
  addAddress: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.ADDRESS, data);
    return response.data;
  },
  updateAddress: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.ADDRESS_DETAIL(id), data);
    return response.data;
  },
  deleteAddress: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.USER.ADDRESS_DETAIL(id));
    return response.data;
  },
  setDefaultAddress: async (id) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.USER.ADDRESS_DEFAULT(id));
    return response.data;
  },
};

export default userApi;
