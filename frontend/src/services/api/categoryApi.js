import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const categoryApi = {
  getCategories: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },
  getCategory: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  },
  addCategory: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.CATEGORIES, data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`);
    return response.data;
  },
};

export default categoryApi;
