import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const orderApi = {
  createOrder: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, data);
    return response.data;
  },
  verifyPayment: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.VERIFY, data);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_ORDERS);
    return response.data;
  },
  cancelOrder: async (id, reason) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data;
  },
  returnOrder: async (id, reason) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.RETURN(id), { reason });
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
    return response.data;
  },
};

export default orderApi;
