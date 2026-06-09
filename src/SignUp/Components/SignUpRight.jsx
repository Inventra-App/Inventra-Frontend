import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import '../Style/SignUpRight.css'

const SignUpRight = ({ nav }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        if (!value.trim()) {
          error = 'Email address is required'
        } else if (!value.includes('@')) {
          error = 'Email address must contain "@"'
        }
        break
      case 'phone':
        if (!value.trim()) error = 'Phone number is required'
        break
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long'
        } else if (!/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          error = 'Password must contain at least one symbol'
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
      const value = formData[field]
      let error = ''

      if (field === 'firstName' && !value.trim()) error = 'First name is required'
      if (field === 'lastName' && !value.trim()) error = 'Last name is required'
      if (field === 'businessName' && !value.trim()) error = 'Business name is required'
      if (field === 'email') {
        if (!value.trim()) error = 'Email address is required'
        else if (!value.includes('@')) error = 'Email address must contain "@"'
      }
      if (field === 'phone' && !value.trim()) error = 'Phone number is required'
      if (field === 'password') {
        if (!value) error = 'Password is required'
        else if (value.length < 8) error = 'Password must be at least 8 characters long'
        else if (!/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) error = 'Password must contain at least one symbol'
      }
      if (field === 'confirmPassword') {
        if (!value) error = 'Please confirm your password'
        else if (value !== formData.password) error = 'Passwords do not match'
      }
      if (field === 'agree' && !value) error = 'You must accept the terms and privacy policy'

      if (error) newErrors[field] = error
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
              placeholder="Chibuzor" 
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
              placeholder="Azubuike" 
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
              type="text" 
              name="email"
              placeholder="Ajchibuzor@gmail.com" 
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
              placeholder="+234 906 927 3334" 
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
          <button type="submit" className="signup-btn" disabled={isSubmitting}>
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
  )
}

export default SignUpRight