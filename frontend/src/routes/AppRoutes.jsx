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
const OrderDetailPage = lazy(() => import("../pages/orders/OrderDetailPage"));
const ProfilePage = lazy(() => import("../pages/auth/ProfilePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const OtpPage = lazy(() => import("../pages/auth/OtpPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const AboutPage = lazy(() => import("../pages/common/AboutPage"));
const ContactPage = lazy(() => import("../pages/common/ContactPage"));

const AppRoutes = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <Loader fullScreen text="Checking authentication..." />;
    }

    const getRootElement = () => {
        if (loading) return <Loader fullScreen text="Checking authentication..." />;
        
        // If authenticated as user go to home
        if (isAuthenticated) {
            return <Navigate to="/home" replace />;
        }
        
        return <LandingPage />;
    };

    return (
        <Suspense fallback={<Loader fullScreen text="Loading..." />}>
            <Routes>
                
                <Route path="/" element={getRootElement()} />
                <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
                <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
                <Route path="/home" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><HomePage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><ProductsPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products/:id" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><ProductsPage /></AppLayout>
                    </ProtectedRoute>
                } />
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
                <Route path="/checkout" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><CheckoutPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><OrderConfirmationPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/my-orders" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><MyOrdersPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/order-detail/:id" element={
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><OrderDetailPage /></AppLayout>
                    </ProtectedRoute>
                } />
                <Route path="/payment-failure" element={
                    <ProtectedRoute redirectTo="/login">
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
                    <ProtectedRoute redirectTo="/login">
                        <AppLayout><ProfilePage /></AppLayout>
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
