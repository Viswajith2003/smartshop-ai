import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const couponApi = {
  getCoupons: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.COUPONS.BASE, { params });
    return response.data;
  },
  getCoupon: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.COUPONS.DETAIL(id));
    return response.data;
  },
  addCoupon: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.COUPONS.BASE, data);
    return response.data;
  },
  updateCoupon: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.COUPONS.DETAIL(id), data);
    return response.data;
  },
  deleteCoupon: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.COUPONS.DETAIL(id));
    return response.data;
  },
  applyCoupon: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.COUPONS.APPLY, data);
    return response.data;
  },
};

export default couponApi;
