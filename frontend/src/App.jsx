import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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


function App() {
  return (
    <AuthProvider>  
          <Router>
            <div className="App">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PublicRoute redirectTo="/dashboard">
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute redirectTo="/">
                        <AppLayout>
                          <Home />
                        </AppLayout>
                      </ProtectedRoute>
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
                  <Route
                    path="/reset-pswd"
                    element={
                      <PublicRoute>
                        <ResetPassword />
                      </PublicRoute>
                    }
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
       
    </AuthProvider>
  );
}

export default App;
