import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { signupSchema } from '../../Schemas/auth'
import { signupAdmin } from '../../API/authApi'
import { setRegistrationEmail } from '../../redux/apiSlice'
import '../Style/SignUpRight.css'

const SignUpRight = ({ nav }) => {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agree: false
    }
  })

  const onSubmit = async (data) => {
    if (!data.agree) {
      setError("agree", {
        type: "manual",
        message: "You must agree to the Terms and Privacy Policy to proceed."
      })
      return
    }

    try {
      const { agree, ...backendPayload } = data;
      const response = await signupAdmin(backendPayload);
      dispatch(setRegistrationEmail(data.email));
      toast.success(response?.message || "Welcome to Inventra! Check your email for OTP.");
      nav("/signupverify");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signup-right">
      <div className="signup-right-top">
        <span>Already have an account?</span>
        <a href="/login" className="signup-login-link">Login</a>
      </div>

      <div className="signup-form-wrapper">
        <h2>Get Started with Inventra</h2>
        <p>Create your account and start managing your inventory effortlessly.</p>

        <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="signup-field">
            <label>First Name</label>
            <input 
              type="text" 
              placeholder="Chibuzor" 
              {...register("firstName")} 
            />
            {errors.firstName && <span className="signup-error-text">{errors.firstName.message}</span>}
          </div>

          <div className="signup-field">
            <label>Last Name</label>
            <input 
              type="text" 
              placeholder="Azubuike" 
              {...register("lastName")}
            />
            {errors.lastName && <span className="signup-error-text">{errors.lastName.message}</span>}
          </div>

          <div className="signup-field">
            <label>Business/Store Name</label>
            <input 
              type="text" 
              placeholder="SuperMart Inc." 
              {...register("businessName")}
            />
            {errors.businessName && <span className="signup-error-text">{errors.businessName.message}</span>}
          </div>

          <div className="signup-field">
            <label>Email Address</label>
            <input 
              type="text" 
              placeholder="Ajchibuzor@gmail.com" 
              {...register("email")}
            />
            {errors.email && <span className="signup-error-text">{errors.email.message}</span>}
          </div>

          <div className="signup-field">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="+234 906 927 3334" 
              {...register("phoneNumber")} 
            />
            {errors.phoneNumber && <span className="signup-error-text">{errors.phoneNumber.message}</span>}
          </div>

          <div className="signup-field">
            <label>Password</label>
            <div className="signup-password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                {...register("password")} 
              />
              <button 
                type="button" 
                className="signup-password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="signup-error-text">{errors.password.message}</span>}
          </div>

          <div className="signup-field">
            <label>Confirm Password</label>
            <div className="signup-password-input-wrapper">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                {...register("confirmPassword")} 
              />
              <button 
                type="button" 
                className="signup-password-toggle-btn" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="signup-error-text">{errors.confirmPassword.message}</span>}
          </div>

          <div className="signup-agree-wrapper">
            <div className="signup-agree">
              <input 
                type="checkbox" 
                id="agree" 
                {...register("agree", {
                  onChange: (e) => {
                    if (e.target.checked) clearErrors("agree")
                  }
                })} 
              />
              <label htmlFor="agree">
                I agree to the <a href="/terms" className="signup-link">Terms and Privacy Policy</a>
              </label>
            </div>
            {errors.agree && <span className="signup-error-text">{errors.agree.message}</span>}
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
  )
}

export default SignUpRight