import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const productApi = {
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  },
  // Admin specific product actions
  addProduct: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.PRODUCTS, data);
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
    return response.data;
  },
};

export default productApi;
