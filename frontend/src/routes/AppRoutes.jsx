import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import AppLayout from "../components/layout/AppLayout";

// Lazy loading pages
const HomePage = lazy(() => import("../pages/shop/HomePage"));
const LandingPage = lazy(() => import("../pages/shop/LandingPage"));
const ProductsPage = lazy(() => import("../pages/shop/ProductsPage"));
const WishlistPage = lazy(() => import("../pages/shop/WishlistPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("../pages/cart/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("../pages/shop/OrderConfirmationPage"));
const PaymentFailurePage = lazy(() => import("../pages/shop/PaymentFailurePage"));
const MyOrdersPage = lazy(() => import("../pages/orders/MyOrdersPage"));
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
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <Suspense fallback={<Loader fullScreen text="Loading..." />}>
            <Routes>
                
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />} />
                <Route path="/home" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><HomePage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
                <Route path="/products/:id" element={<AppLayout><ProductsPage /></AppLayout>} />
                <Route path="/wishlist" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><WishlistPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><CartPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><CheckoutPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><OrderConfirmationPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/my-orders" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><MyOrdersPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/payment-failure" element={
                    <ProtectedRoute redirectTo="/">
                        <AppLayout><PaymentFailurePage /></AppLayout>
                    </ProtectedRoute>
                } />

                {/* Auth Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/otp-verify" element={<PublicRoute><OtpPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="/reset-pswd" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
                <Route path="/profile" element={
                    <ProtectedRoute redirectTo="/">
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
