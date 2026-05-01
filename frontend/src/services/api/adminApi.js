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
  getUsers: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/users`, { params });
    return response.data;
  },
  getOrders: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/orders`, { params });
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/orders/${id}/status`, { status });
    return response.data;
  },
  getSalesReport: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.BASE || "/admin"}/sales-report`, { params });
    return response.data;
  },
};

export default adminApi;
