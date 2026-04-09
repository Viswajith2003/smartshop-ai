import React, { useState, useCallback, memo, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { authAPI } from '../services/AuthService'
import otpImg from '../assets/OTP.png'

const OTPVerify = memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const inputRefs = useRef([])

  const validationSchema = Yup.object().shape({
    otp: Yup.array()
      .test('is-filled', 'Please enter the full 6-digit OTP', (val) => {
        return val && val.join('').length === 6;
      })
  });

  const formik = useFormik({
    initialValues: { otp: ['', '', '', '', '', ''] },
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true)
      try {
        const otpValue = values.otp.join('')
        const response = await authAPI.verifyOtp({ email, otp: otpValue })
        
        toast.success(response.message || 'OTP Verified successfully!')
        
        if (location.state?.from === 'forgotPassword') {
          navigate('/reset-pswd', { state: { email, otp: otpValue } })
        } else {
          navigate('/login')
        }
      } catch (err) {
        console.error('OTP Verification error:', err)
        const message = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
        setFieldError('otp', message);
      } finally {
        setLoading(false)
      }
    }
  });

  // Redirect if no email is present
  useEffect(() => {
    if (!email) {
      if (location.state?.from === 'forgotPassword') {
        toast.error('Session expired. Please enter your email again.')
        navigate('/forgot-password')
      } else {
        toast.error('Please register first')
        navigate('/register')
      }
    }
  }, [email, navigate, location.state])

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    try {
      const response = await authAPI.resendOtp(email)
      toast.info(response.message || 'OTP Resent successfully')
      formik.resetForm()
      setTimer(60)
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    } catch (err) {
      console.error('Resend OTP error:', err)
      toast.error(err.message || 'Failed to resend OTP.')
    }
  }, [email, timer])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] min-h-[500px] items-center">
        
        {/* Left Panel - Illustration */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex items-center justify-center">
          <img 
            src={otpImg} 
            alt="OTP Verification Illustration" 
            className="w-full max-w-[320px] object-contain"
          />
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#9333ea] mb-6">Verify OTP</h2>
            <p className="text-gray-500 font-medium">
              Enter 6 digit code sent to <span className="text-gray-700">{email}</span>
            </p>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 md:gap-4 max-w-sm mx-auto">
              {formik.values.otp.map((data, index) => (
                <input
                  key={index}
                  name={`otp[${index}]`}
                  type="text"
                  maxLength="1"
                  ref={el => inputRefs.current[index] = el}
                  value={data}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isNaN(val)) return;
                    
                    formik.setFieldValue(`otp[${index}]`, val);
                    
                    if (formik.errors.otp) {
                      formik.setFieldError('otp', undefined);
                    }
                    
                    if (val !== '' && index < 5) {
                      inputRefs.current[index + 1].focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && formik.values.otp[index] === '' && index > 0) {
                      inputRefs.current[index - 1].focus();
                    }
                  }}
                  className={`w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold bg-white border-2 ${formik.errors.otp && typeof formik.errors.otp === 'string' ? 'border-red-500 focus:ring-red-100 text-red-500' : 'text-[#9333ea] border-[#9333ea] focus:ring-purple-100'} rounded-xl focus:outline-none focus:ring-4 transition-all`}
                />
              ))}
            </div>

            {formik.errors.otp && typeof formik.errors.otp === 'string' && (
              <div className="text-center text-red-500 font-bold -mt-4 text-sm animate-pulse">
                {formik.errors.otp}
              </div>
            )}

            <div className="text-center mt-4">
              <p className="text-gray-600 font-medium mb-8">
                Don't receive the code ? {' '}
                <button 
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`font-bold transition-all ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#9333ea] hover:underline'}`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </p>
              
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
                    Verifying...
                  </span>
                ) : 'Verify & Proceed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

OTPVerify.displayName = 'OTPVerify'

export default OTPVerify
