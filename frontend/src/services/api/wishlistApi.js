import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const wishlistApi = {
  getWishlist: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST.GET);
    return response.data;
  },
  toggleWishlist: async (productId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.WISHLIST.TOGGLE, { productId });
    return response.data;
  },
  clearWishlist: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.WISHLIST.CLEAR);
    return response.data;
  },
};

export default wishlistApi;
