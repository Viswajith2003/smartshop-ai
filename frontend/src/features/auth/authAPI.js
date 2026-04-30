import { authApi, userApi } from "../../services/api";
export const authAPI = { ...authApi, ...userApi };
export default authAPI;
