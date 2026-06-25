import React, { useState, useRef, useEffect } from 'react'
import { Shield, BarChart2, Users, Lock, CheckCircle, Clock, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import { resendOtp, verifySignupEmail } from '../../API/authApi'
import './Css/SignUpVerify.css'
import Header from '../../Components/Header' 
import toast from 'react-hot-toast'
import logo from '../../assets/Logo 2.png'

const SignUpVerify = () => {
  const completeState = useSelector((state) => state);
  console.log("👉 CURRENT REDUX STATE ACCESSED BY VERIFY PAGE:", completeState);
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimeLeft, setResendTimeLeft] = useState(180)
  const [showPopup, setShowPopup] = useState(false)
  const [showFailedPopup, setShowFailedPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const email = useSelector((state) => state.apiInfo?.registrationEmail || "");

  const getMaskedEmail = () => {
    if (!email) return "your email address";
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local}***@${domain}`;
    return `${local.slice(0, 2)}******@${domain}`;
  };

  useEffect(() => {
    if (resendTimeLeft <= 0) return
    const timer = setInterval(() => {
      setResendTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendTimeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
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

  const closeFailedPopup = () => {
    setShowFailedPopup(false)
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

  const handleVerify = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!email) {
      setError("Registration email context missing. Please sign up again.");
      toast.error("Registration email missing.");
      return;
    }

    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError('Please fill in all 6 verification digits')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const payload = {
        email: email,
        otp: otpCode,
      }

      console.log("=== SENDING OTP PAYLOAD ===", payload)
      await verifySignupEmail(payload)

      setShowPopup(true)
      // toast.success(res?.message || "Account verified successfully!");

      setTimeout(() => {
        setShowPopup(false)
        navigate('/login')
      }, 3000)

    } catch (err) {
      console.error("OTP VERIFICATION ERROR:", err)
      const serverErrorMessage = err.response?.data?.message || "Invalid or expired OTP";
      setError(serverErrorMessage)
      setShowFailedPopup(true)
      toast.error(serverErrorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (isResending || resendTimeLeft > 0) return
    if (!email) {
      toast.error("Cannot resend. Email context missing.");
      return;
    }

    try {
      setIsResending(true)
      setError('')

      console.log(`Triggered resend OTP request packet for: ${email}`)
      const res = await resendOtp(email);
      console.log("=== RESEND OTP DATA SUBSET ===", res);
      
      setResendTimeLeft(180)
      setOtp(['', '', '', '', '', ''])
      toast.success(res?.message || "OTP has been resent to your email address!");
    } catch (err) {
      console.error("RESEND ROUTE API ERROR:", err);

      const serverErrorMessage = err.response?.data?.message || "Failed to resend validation token.";
      toast.error(serverErrorMessage);
      setError(serverErrorMessage);

    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="verify-page">
      <div className="verify-mobile-nav-container">
        <Header />
      </div>

      <div className="verify-left">
        <div className="verify-left-logo">
          <img src={logo} alt="Logo" />
          <span>Inventra</span>
        </div>

        <div className="verify-left-content">
          <h1>One step closer to <br /><span>smarter inventory</span></h1>
          <p>Enter the OTP sent to your email to verify your account and continue</p>

          <div className="verify-features">
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><Shield size={20} color='#6366F1' /></div>
              <div>
                <h4>Secure & Protected</h4>
                <p>Your data is safe with enterprise grade security</p>
              </div>
            </div>
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><BarChart2 size={20} color='#6366F1' /></div>
              <div>
                <h4>Real-time Access</h4>
                <p>Verify and access your dashboard</p>
              </div>
            </div>
            <div className="verify-feature-item">
              <div className="verify-feature-icon"><Users size={20} color='#6366F1' /></div>
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
        <div className="verify-form-wrapper">
          <h2>Verify Your Account</h2>
          <p>We've sent a 6-digit OTP to your email address <span className="verify-email">{getMaskedEmail()}</span></p>

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
                  disabled={isSubmitting}
                />
              ))}
            </div>
            {error && <span className="verify-error-text">{error}</span>}
          </div>

          <div className="verify-resend-row">
            <span>Didn't receive code?</span>
            <button 
              className="verify-resend-btn" 
              onClick={handleResendOtp} 
              disabled={isResending || resendTimeLeft > 0}
            >
              {isResending && 'Sending...'}
              {!isResending && resendTimeLeft > 0 && `Resend OTP in ${formatTime(resendTimeLeft)}`}
              {!isResending && resendTimeLeft === 0 && 'Resend OTP'}
            </button>
          </div>

          <button 
            className="verify-btn" 
            onClick={handleVerify}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>

          <p className="verify-security-text">
            For your security, this code will expires in 3 minutes
          </p>

        </div>

        <div className="verify-bottom-footer">
          <div className="verify-trust-item"><Lock size={14} color='#6B7280'/><span>Secure Login</span></div>
          <div className="verify-trust-item"><CheckCircle size={14} color='#6B7280'/><span>Data Protected</span></div>
          <div className="verify-trust-item"><Clock size={14} color='#6B7280'/><span>24/7 Support</span></div>
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

      {showFailedPopup && (
        <div className="modal-overlay" onClick={closeFailedPopup}>
          <div
            className="failed-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-failed-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="failed-badge-icon">
              <X size={52} strokeWidth={3.5} />
            </div>
            <h3 id="verification-failed-title">Verification Failed</h3>
            <p>The OTP you entered is incorrect or has expired.</p>
            <p>Please try again.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUpVerify
