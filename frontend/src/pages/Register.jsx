import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authAPI } from '../services/AuthService'

const Register = React.memo(() => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = useCallback(async (data) => {
    setLoading(true)

    try {
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      const response = await authAPI.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
      })

      console.log('Registration success:', response)
      toast.success(response.message || 'Registration successful! Please verify OTP.')

      // Navigate to OTP verify page with email in state
      navigate('/otp-verify', { replace: true, state: { email: data.email } })
    } catch (err) {
      console.error('Registration error:', err)
      const message = err.message || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] min-h-[600px]">
        
        {/* Left Panel - Get Started */}
        <div className="w-full md:w-[45%] bg-[#9333ea] p-8 md:p-12 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Started</h2>
          <p className="text-purple-100 mb-8 text-lg">Already have an account ?</p>
          <Link 
            to="/login" 
            className="px-12 py-3 border-2 border-white rounded-xl text-lg font-medium hover:bg-white hover:text-[#9333ea] transition-all duration-300"
          >
            Login
          </Link>
        </div>

        {/* Right Panel - Create Account */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#9333ea] text-center mb-10">Create Account</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                  className={`w-full px-6 py-4 bg-[#fdf2ff] border ${errors.fullName ? 'border-red-500' : 'border-purple-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.fullName.message}</p>}
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full px-6 py-4 bg-[#fdf2ff] border ${errors.email ? 'border-red-500' : 'border-purple-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password (min 8 characters)"
                  {...register('password', { 
                    required: 'Password is required', 
                    minLength: { value: 8, message: 'Password must be at least 8 characters' } 
                  })}
                  className={`w-full px-6 py-4 bg-[#fdf2ff] border ${errors.password ? 'border-red-500' : 'border-purple-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password.message}</p>}
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (val) => {
                      if (watch('password') !== val) {
                        return "Passwords do not match";
                      }
                    }
                  })}
                  className={`w-full px-6 py-4 bg-[#fdf2ff] border ${errors.confirmPassword ? 'border-red-500' : 'border-purple-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 text-gray-700 transition-all`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword.message}</p>}
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
                    Signing Up...
                  </span>
                ) : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

Register.displayName = 'Register'

export default Register
