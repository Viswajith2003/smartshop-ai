import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const cartApi = {
  addToCart: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, data);
    return response.data;
  },
  getCart: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },
  updateQuantity: async (data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, data);
    return response.data;
  },
  deleteCartItem: async (productId) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.DELETE(productId));
    return response.data;
  },
  toggleSelection: async (data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.CART.TOGGLE_SELECTION, data);
    return response.data;
  },
};

export default cartApi;
