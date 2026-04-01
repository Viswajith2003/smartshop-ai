import React, { useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
// import { FormInput, Button } from "../components/ui";

const Login = memo(() => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = useCallback(async (data) => {
    setLoading(true);

    try {
      const { authAPI, adminAPI, setAuthToken, setAdminToken } = await import(
        "../utils/api"
      );
      const isAdminAttempt =
        data.email.includes("admin") || data.email === "admin@example.com";

      let response;
      if (isAdminAttempt) {
        response = await adminAPI.login({
          email: data.email,
          password: data.password,
        });
        setAdminToken(response.data.token);
      } else {
        response = await authAPI.login({
          email: data.email,
          password: data.password,
        });
        setAuthToken(response.data.token);
      }
      const userData = response.data.user || response.data.admin;

      const user = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || (isAdminAttempt ? "admin" : "user"),
        avatar: userData.avatar || null,
      };

      login(user);
      toast.success(`Welcome back, ${userData.name || "User"}!`);

      setTimeout(() => {
        if (user.role === "admin" || isAdminAttempt) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] min-h-[600px]">
        
        {/* Left Panel - Welcome Back */}
        <div className="w-full md:w-[45%] bg-[#9333ea] p-8 md:p-12 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-purple-100 mb-2 text-lg">Please Enter your details.</p>
          <p className="text-purple-100 mb-8 text-lg">Don't have an account ?</p>
          <Link 
            to="/register" 
            className="px-12 py-3 border-2 border-white rounded-xl text-lg font-medium hover:bg-white hover:text-[#9333ea] transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Right Panel - Login */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-[#9333ea] text-center mb-10">Log in</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Phone/Email"
                  {...register('email')}
                  required
                  className="w-full px-6 py-4 bg-[#fdf2ff] border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  required
                  className="w-full px-6 py-4 bg-[#fdf2ff] border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#9333ea] text-white rounded-xl text-xl font-semibold shadow-lg hover:bg-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : 'Log in'}
              </button>
              
              <div className="mt-6">
                <Link to="/forgot-password" size="sm" className="text-[#9333ea] font-medium hover:underline">
                  forgot password
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

Login.displayName = "Login";

export default Login;
