import React, { useState, useCallback, memo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import otpImg from '../assets/OTP.png'

const OTPVerify = memo(() => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = useCallback((element, index) => {
    if (isNaN(element.value)) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }, [otp])

  const handleKeyDown = useCallback((e, index) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }, [otp])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    
    if (otpValue.length < 6) {
      toast.error('Please enter the full 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      console.log('Verifying OTP:', otpValue)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('OTP Verified successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error('OTP Verification error:', err)
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [otp, navigate])

  const handleResend = useCallback(() => {
    toast.info('OTP Resent to your phone number')
    // Reset OTP fields
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0].focus()
  }, [])

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
              Enter 6 digit code sent to <span className="text-gray-700">+91 6666666666</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 md:gap-4 max-w-sm mx-auto">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={el => inputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold text-[#9333ea] bg-white border-2 border-[#9333ea] rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 font-medium mb-8">
                Don't receive the code ? {' '}
                <button 
                  type="button"
                  onClick={handleResend}
                  className="text-[#9333ea] font-bold hover:underline"
                >
                  Resend OTP
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
