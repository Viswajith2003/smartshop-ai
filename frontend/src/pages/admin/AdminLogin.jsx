import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { 
  loginStart, 
  adminLoginSuccess, 
  loginFailure 
} from "../../features/auth/authSlice";
import { adminAPI } from "../../services/api";
import { setAdminToken } from "../../services/axiosInstance";
import { ShoppingCart, LogIn, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await adminAPI.login({
        email: data.email,
        password: data.password,
      });

      setAdminToken(response.data.token);
      const userData = response.data.admin;

      const admin = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: "admin",
      };

      dispatch(adminLoginSuccess(admin));
      toast.success(`Welcome back, Commander ${userData.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Admin login error:", err);
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Admin login failed.";
      dispatch(loginFailure(message));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07011d] p-4 font-sans">
      <div className="w-full max-w-md bg-[#02001c] rounded-[2rem] p-10 border border-[#1a1c3d] shadow-[0_0_50px_rgba(147,51,234,0.1)] relative overflow-hidden group">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

        <div className="text-center mb-10 relative">
          <div className="inline-flex p-4 bg-[#1e1470]/40 rounded-2xl border border-purple-500/30 mb-6 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
            {/* Inline SVG since we already have it in dashboard */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-[#9333ea]">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Smart Shop</h1>
          <p className="text-[11px] text-gray-500 uppercase font-black tracking-[0.3em]">Management Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Admin Email</label>
              <input
                type="email"
                placeholder="admin@smartshop.com"
                {...register('email', { required: 'Admin email is required' })}
                className="w-full px-6 py-4 bg-[#0a052d] border border-[#1a1c3d] rounded-2xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-bold"
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full px-6 py-4 bg-[#0a052d] border border-[#1a1c3d] rounded-2xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-bold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[18px] text-gray-500 hover:text-purple-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(147,51,234,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Authorizing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In to Control Center
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#1a1c3d] text-center">
            <p className="text-gray-600 text-xs font-bold leading-relaxed">
                Unauthorized access is strictly monitored. <br/>
                IP logged by security systems.
            </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
