import React, { useState, useEffect } from 'react'
import { Package, CalendarCheck, TrendingUp, Shield, Users, Clock, Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/Inventra Logo.png'
import bg1 from '../../assets/SignUp bdg.jpg'
import bg2 from '../../assets/Pricing bdg.jpg'
import bg3 from '../../assets/Warehouse.jpg'
import './Css/SignUp.css'
import Header from '../../Components/Header'
import { useNavigate } from 'react-router-dom'

const backgrounds = [bg1, bg2, bg3]

const SignUp = () => {
  const [currentBg, setCurrentBg] = useState(0)
  const [nextBg, setNextBg] = useState(1)
  const [fading, setFading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const nav = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setNextBg((prev) => (prev + 1) % backgrounds.length)
      setFading(true)
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % backgrounds.length)
        setFading(false)
      }, 2500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required'
        break
      case 'lastName':
        if (!value.trim()) error = 'Last name is required'
        break
      case 'businessName':
        if (!value.trim()) error = 'Business name is required'
        break
      case 'email':
        if (!value.trim()) error = 'Email address is required'
        break
      case 'phone':
        if (!value.trim()) error = 'Phone number is required'
        break
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long'
        } else if (!value.includes('@')) {
          error = 'Password must contain the "@" symbol'
        } else if (!/[!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          error = 'Password must contain at least one other symbol'
        }
        break
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password'
        } else if (value !== formData.password) {
          error = 'Passwords do not match'
        }
        break
      case 'agree':
        if (!value) error = 'You must accept the terms and privacy policy'
        break
      default:
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setFormData((prev) => ({ ...prev, [name]: fieldValue }))

    if (touched[name] || type === 'checkbox') {
      validateField(name, fieldValue)
    }

    if (name === 'password' && formData.confirmPassword && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: fieldValue !== formData.confirmPassword ? 'Passwords do not match' : ''
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, fieldValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isSubmitting) return

    const fieldsToValidate = Object.keys(formData)
    const newErrors = {}
    const allTouched = {}

    fieldsToValidate.forEach((field) => {
      allTouched[field] = true
      
      let error = ''
      const value = formData[field]

      if (field === 'firstName' && !value.trim()) error = 'First name is required'
      if (field === 'lastName' && !value.trim()) error = 'Last name is required'
      if (field === 'businessName' && !value.trim()) error = 'Business name is required'
      if (field === 'email' && !value.trim()) error = 'Email address is required'
      if (field === 'phone' && !value.trim()) error = 'Phone number is required'
      
      if (field === 'password') {
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long'
        } else if (!value.includes('@')) {
          error = 'Password must contain the "@" symbol'
        } else if (!/[!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          error = 'Password must contain at least one other symbol'
        }
      }
      
      if (field === 'confirmPassword') {
        if (!value) error = 'Please confirm your password'
        else if (value !== formData.password) error = 'Passwords do not match'
      }
      
      if (field === 'agree' && !value) error = 'You must accept the terms and privacy policy'

      if (error) {
        newErrors[field] = error
      }
    })

    setTouched(allTouched)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      setTimeout(() => {
        nav('/signupverify')
      }, 1500)
    }
  }

  return (
    <div className="signup-page">

      <div className="signup-mobile-header">
        <Header />
      </div>

      <div className="signup-left">
        <div
          className="signup-bg"
          style={{ backgroundImage: `url(${backgrounds[nextBg]})`, opacity: 1 }}
        />
        <div
          className="signup-bg"
          style={{ backgroundImage: `url(${backgrounds[currentBg]})`, opacity: fading ? 0 : 1 }}
        />
        <div className="signup-overlay" />

        <div className="signup-left-logo">
          <img src={logo} alt="Inventra" className="signup-logo-img" />
          <span>Inventra</span>
        </div>

        <div className="signup-left-content">
          <h1>Smart Inventory <br /> Management for Modern <br /> Supermarkets</h1>
          <p>Streamline your operations with intelligent inventory tracking, automated expiry management, and real-time sales analytics.</p>

          <div className="signup-features">
            <div className="signup-feature-item">
              <div className="signup-feature-icon"><Package size={20} /></div>
              <div>
                <h4>Smart Inventory</h4>
                <p>Track stock levels in real-time with automated reorder alerts and smart forecasting.</p>
              </div>
            </div>
            <div className="signup-feature-item">
              <div className="signup-feature-icon"><CalendarCheck size={20} /></div>
              <div>
                <h4>Expiry Management</h4>
                <p>Never lose money to expired products. Get timely notifications and insights.</p>
              </div>
            </div>
            <div className="signup-feature-item">
              <div className="signup-feature-icon"><TrendingUp size={20} /></div>
              <div>
                <h4>Sales & Reports</h4>
                <p>Comprehensive analytics and reporting to make data-driven decisions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="signup-left-footer">
          <div className="signup-trust-item"><Shield size={16} /><span>Secure & Encrypted</span></div>
          <div className="signup-trust-item"><Users size={16} /><span>Team Collaboration</span></div>
          <div className="signup-trust-item"><Clock size={16} /><span>24/7 Support</span></div>
        </div>

      </div>

      <div className="signup-right">
        <div className="signup-right-top">
          <span>Already have an account?</span>
          <a href="/login" className="signup-login-link">Login</a>
        </div>

        <div className="signup-form-wrapper">
          <h2>Get Started with Inventra</h2>
          <p>Create your account and start managing your inventory, sales, and expiry effortlessly.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName"
                placeholder="Anthony" 
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.firstName && errors.firstName && <span className="signup-error-text">{errors.firstName}</span>}
            </div>
            <div className="signup-field">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                placeholder="Onyema" 
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.lastName && errors.lastName && <span className="signup-error-text">{errors.lastName}</span>}
            </div>
            <div className="signup-field">
              <label>Business/Store Name</label>
              <input 
                type="text" 
                name="businessName"
                placeholder="SuperMart Inc." 
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.businessName && errors.businessName && <span className="signup-error-text">{errors.businessName}</span>}
            </div>
            <div className="signup-field">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="aonyema512@gmail.com" 
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && <span className="signup-error-text">{errors.email}</span>}
            </div>
            <div className="signup-field">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="+234 905 672 4944" 
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.phone && errors.phone && <span className="signup-error-text">{errors.phone}</span>}
            </div>
            <div className="signup-field">
              <label>Password</label>
              <div className="signup-password-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="signup-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.password && errors.password && <span className="signup-error-text">{errors.password}</span>}
            </div>
            <div className="signup-field">
              <label>Confirm Password</label>
              <div className="signup-password-input-wrapper">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="signup-password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && <span className="signup-error-text">{errors.confirmPassword}</span>}
            </div>
            <div className="signup-agree-wrapper">
              <div className="signup-agree">
                <input 
                  type="checkbox" 
                  id="agree" 
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />
                <label htmlFor="agree">
                  I agree to the <a href="/terms" className="signup-link">Terms and Privacy Policy</a>
                </label>
              </div>
              {touched.agree && errors.agree && <span className="signup-error-text">{errors.agree}</span>}
            </div>
            <button 
              type="submit" 
              className="signup-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="signup-divider"><span>or continue with</span></div>
            <button type="button" className="signup-google-btn" onClick={() => nav("/supermarket-info")}>
              <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
              Google
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default SignUp