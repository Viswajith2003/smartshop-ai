import React, { useState, useCallback, memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { authAPI } from '../../features/auth/authAPI'

const ResetPasswordPage = memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  // Redirect if no email is present
  React.useEffect(() => {
    if (!email) {
      toast.error('Please request a password reset first')
      navigate('/forgot-password', { replace: true })
    }
  }, [email, navigate])

  const onSubmit = useCallback(async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.resetPassword({
        email,
        otp: location.state?.otp,
        newPassword: data.password
      })
      
      toast.success(response.message || 'Password reset successfully!')
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Reset password error:', err)
      toast.error(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [navigate, email, location.state?.otp])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] min-h-[550px]">
        
        {/* Left Panel - Welcome Back */}
        <div className="w-full md:w-[45%] bg-indigo-600 p-8 md:p-12 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h2>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 text-center mb-10">Reset Password</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  {...register('password')}
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[18px] text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  {...register('confirmPassword')}
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[18px] text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xl font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

ResetPasswordPage.displayName = 'ResetPasswordPage'

export default ResetPasswordPage
