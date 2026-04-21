import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/Route";
import { Loading } from "./components/ui";
import AppLayout from "./components/AppLayout";

const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Home = React.lazy(() => import("./pages/Home"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ForgotPassword = React.lazy(() => import("./pages/forgotPswd"));
const OtpVerify = React.lazy(() => import("./pages/Otp_verify"));
const ResetPassword = React.lazy(() => import("./pages/ResetPswd"));
const AdminDash = React.lazy(() => import("./pages/AdminDash"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));


function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <Home />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <ProductsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <ProductsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <CartPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute redirectTo="/login">
                  <AppLayout>
                    <WishlistPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute redirectTo="/">
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute redirectTo="/">
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Navigate to="/" replace />
              }
            />
            
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/otp-verify"
              element={
                <OtpVerify />
              }
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute redirectTo="/admin/dashboard">
                  <AdminLogin />
                </PublicRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDash />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="/reset-pswd"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
