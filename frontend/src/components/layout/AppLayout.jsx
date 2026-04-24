import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = React.memo(({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
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
