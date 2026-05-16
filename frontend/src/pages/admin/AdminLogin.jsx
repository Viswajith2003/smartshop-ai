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
import { ShoppingCart, LogIn, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

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
      toast.success(`Welcome back, Admin ${userData.name}!`);
      navigate('/admin/dashboard', { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] min-h-[600px]">
        
        {/* Left Panel - Admin Portal */}
        <div className="w-full md:w-[45%] bg-indigo-600 p-8 md:p-12 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 relative z-10">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight uppercase relative z-10">Admin Portal</h2>
          <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs opacity-80 relative z-10">Restricted Access Only</p>
          
          <div className="mt-12 space-y-4 w-full relative z-10">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
              <Lock className="w-5 h-5 text-indigo-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-left">Secure 256-bit Encryption</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
              <LogIn className="w-5 h-5 text-indigo-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-left">IP Logging Enabled</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="email"
                    placeholder="admin@smartshop.ai"
                    {...register('email', { required: 'Admin email is required' })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-12 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all transform active:scale-95 disabled:opacity-50 group mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : 'Access Dashboard'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Forgot credentials? <a href="#" className="text-indigo-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
