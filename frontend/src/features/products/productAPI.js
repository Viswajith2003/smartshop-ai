import axiosInstance from '../../services/axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const productAPI = {
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PRODUCTS, { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
    return response.data;
  },
  addProduct: async (productData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.PRODUCTS, productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
    return response.data;
  }
};

export default productAPI;
