import authApi from "./authApi";
import userApi from "./userApi";
import productApi from "./productApi";
import cartApi from "./cartApi";
import orderApi from "./orderApi";
import couponApi from "./couponApi";
import categoryApi from "./categoryApi";
import adminApi from "./adminApi";
import wishlistApi from "./wishlistApi";

export {
  authApi,
  userApi,
  productApi,
  cartApi,
  orderApi,
  couponApi,
  categoryApi,
  adminApi,
  wishlistApi,
};

// Aliases for backward compatibility
export const authAPI = authApi;
export const userAPI = userApi;
export const productAPI = productApi;
export const cartAPI = cartApi;
export const orderAPI = orderApi;
export const couponAPI = couponApi;
export const categoryAPI = categoryApi;
export const adminAPI = adminApi;
export const wishlistAPI = wishlistApi;

export default {
  auth: authApi,
  user: userApi,
  product: productApi,
  cart: cartApi,
  order: orderApi,
  coupon: couponApi,
  category: categoryApi,
  admin: adminApi,
  wishlist: wishlistApi,
};
