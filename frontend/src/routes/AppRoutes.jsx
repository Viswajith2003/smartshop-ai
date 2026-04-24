import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Loader from "../components/common/Loader";
import AppLayout from "../components/layout/AppLayout";

// Lazy loading pages
const HomePage = lazy(() => import("../pages/shop/HomePage"));
const ProductsPage = lazy(() => import("../pages/shop/ProductsPage"));
const WishlistPage = lazy(() => import("../pages/shop/WishlistPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const ProfilePage = lazy(() => import("../pages/auth/ProfilePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const OtpPage = lazy(() => import("../pages/auth/OtpPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLogin"));
const ProductManagement = lazy(() => import("../pages/admin/ProductManagement"));
const OrderManagement = lazy(() => import("../pages/admin/OrderManagement"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader fullScreen text="Loading..." />}>
            <Routes>
                {/* Shop Routes */}
                <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
                <Route path="/products/:id" element={<AppLayout><ProductsPage /></AppLayout>} />
                <Route path="/wishlist" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><WishlistPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><CartPage /></AppLayout>
                    </ProtectedRoute>
                } />

                {/* Auth Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/otp-verify" element={<PublicRoute><OtpPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="/reset-pswd" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
                <Route path="/profile" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><ProfilePage /></AppLayout>
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<PublicRoute redirectTo="/admin/dashboard"><AdminLoginPage /></PublicRoute>} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute role="admin">
                        <ProductManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedRoute role="admin">
                        <OrderManagement />
                    </ProtectedRoute>
                } />

                {/* Utility Routes */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
