import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, fetchProfile } from "../../features/auth/authSlice";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";
import { fetchCart } from "../../features/cart/cartSlice";
import { getUser } from "../../services/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = React.memo(({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchWishlist());
      const user = getUser();
      if (user) {
        dispatch(fetchCart(user.id || user._id));
      }
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = useCallback(() => {
    navigate("/", { replace: true });
    dispatch(logout());
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLogout={handleLogout} />

      {/* Main Content Area - pt-20 offsets the new compact fixed navbar (80px) */}
      <main className="flex-grow pt-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 py-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
});

AppLayout.displayName = "AppLayout";

export default AppLayout;
