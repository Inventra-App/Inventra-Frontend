import React, { useState, useRef, useEffect } from 'react'
import { Shield, BarChart2, Users, Lock, CheckCircle, Clock, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Inventra Logo.png'
import './Css/SignUpVerify.css'

const SignUpVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(165)
  const [showPopup, setShowPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    
    if (error) setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(paste)) return
    const newOtp = paste.split('')
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
    if (error) setError('')
    inputRefs.current[Math.min(paste.length - 1, 5)].focus()
  }

  const handleVerify = (e) => {
    e.preventDefault()
    
    if (isSubmitting) return

    const isOtpComplete = otp.every(digit => digit !== '')

    if (!isOtpComplete) {
      setError('Please fill in all 6 verification digits')
      return
    }

    setIsSubmitting(true)
    setShowPopup(true)
    
    setTimeout(() => {
      setShowPopup(false)
      navigate('/login')
    }, 3000)
  }

  return (
    <div className="verify-page">
      <div className="verify-left">
        <div className="verify-left-logo">
          <img src={logo} alt="Inventra" className="verify-logo-img" />
          <span>Inventra</span>
        </div>

        <div className="verify-left-content">
          <h1>One step closer to <br /><span>smarter inventory</span></h1>
          <p>Enter the OTP sent to your email to verify your account and continue</p>

          <div className="verify-features">
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><Shield size={20} /></div>
              <div>
                <h4>Secure & Protected</h4>
                <p>Your data is safe with enterprise grade security</p>
              </div>
            </div>
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><BarChart2 size={20} /></div>
              <div>
                <h4>Real-time Access</h4>
                <p>Verify and access your dashboard</p>
              </div>
            </div>
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><Users size={20} /></div>
              <div>
                <h4>All in One Platform</h4>
                <p>Manage inventory, sales, expiry, & staff accountability in one place</p>
              </div>
            </div>
          </div>
        </div>

        <div className="verify-left-footer">
          <div className="verify-trust-item"><Lock size={14} /><span>Secure Login</span></div>
          <div className="verify-trust-item"><CheckCircle size={14} /><span>Data Protected</span></div>
          <div className="verify-trust-item"><Clock size={14} /><span>24/7 Support</span></div>
        </div>
      </div>

      <div className="verify-right">
        <div className="verify-right-top">
          <span>Didn't receive code?</span>
          <button className="verify-resend-btn" disabled={isSubmitting}>Resend OTP</button>
        </div>

        <div className="verify-form-wrapper">
          <h2>Verify Your Account</h2>
          <p>We've sent a 6-digit OTP to your email address <span className="verify-email">ao******@gmail.com</span></p>

          <div className="verify-otp-container">
            <div className="verify-otp-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className={`verify-otp-input ${error ? 'verify-otp-input-error' : ''}`}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            {error && <span className="verify-error-text">{error}</span>}
          </div>

          <p className="verify-timer">
            OTP expires in <span className="verify-timer-count">{formatTime(timeLeft)}</span>
          </p>

          <button 
            className="verify-btn" 
            onClick={handleVerify}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>

          <div className="verify-bottom-footer">
            <div className="verify-trust-item"><Lock size={14} /><span>Secure Login</span></div>
            <div className="verify-trust-item"><CheckCircle size={14} /><span>Data Protected</span></div>
            <div className="verify-trust-item"><Clock size={14} /><span>24/7 Support</span></div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-badge-icon">
              <Check size={36} strokeWidth={3} />
            </div>
            <h3>Verification Successful</h3>
            <p>Your account has been verified successfully.</p>
            <p className="redirect-text">Redirecting you to login....</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUpVerify