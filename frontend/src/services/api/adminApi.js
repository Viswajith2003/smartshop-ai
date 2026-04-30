import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const adminApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.LOGIN, credentials);
    return response.data;
  },
  getDashboard: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },
  getUsers: async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/users`);
    return response.data;
  },
  getOrders: async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/orders`);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/orders/${id}/status`, { status });
    return response.data;
  },
};

export default adminApi;
