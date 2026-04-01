import React, { useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ResetPassword = memo(() => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  // Watch confirmation field to validate match
  const password = watch('password')

  const onSubmit = useCallback(async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      console.log('Resetting password...')
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      console.error('Reset password error:', err)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] min-h-[550px]">
        
        {/* Left Panel - Welcome Back */}
        <div className="w-full md:w-[45%] bg-[#9333ea] p-8 md:p-12 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h2>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9333ea] text-center mb-10">Reset Password</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password"
                  {...register('password')}
                  required
                  className="w-full px-6 py-4 bg-[#fdf2ff] border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  {...register('confirmPassword')}
                  required
                  className="w-full px-6 py-4 bg-[#fdf2ff] border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-4">
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

ResetPassword.displayName = 'ResetPassword'

export default ResetPassword
