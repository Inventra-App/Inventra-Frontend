import React, { useRef, useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { forgetPassword, resetPassword, verifyPasswordOtp } from "../API/authApi";
import forgetImg from "../assets/ForgetImg1.png";
import codeImg from "../assets/ForgetImg2.png";
import resetImg from "../assets/ForgetImg3.png";
import "../Css/ForgetPassUi.css";

const ForgetPassUi = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [passwordFields, setPasswordFields] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const otpRefs = useRef([]);
  const maskedEmail = email || "j***@inventra.com";

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setTouched((prev) => ({ ...prev, email: true }));

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email address is required" }));
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      const payload = { email: email.trim() };
      await forgetPassword(payload);
      setStep("sent");
      setTouched({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    if (digit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData) {
      const nextOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        nextOtp[i] = pastedData[i];
      }
      setOtp(nextOtp);
      setErrors((prev) => ({ ...prev, otp: "" }));

      const lastFilledIndex = Math.min(pastedData.length, otpRefs.current.length - 1);
      otpRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setErrors((prev) => ({ ...prev, otp: "Please enter the complete 6-digit verification code" }));
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrors({});
      
      await verifyPasswordOtp({
        email: email.trim(),
        otp: otpString
      });

      setStep("password");
    } catch (error) {
      const apiMessage = error.response?.data?.message || error.message || "Invalid verification code. Please try again.";
      setErrors((prev) => ({ ...prev, otp: apiMessage }));
      toast.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validatePasswords(name, value);
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validatePasswords(name, value);
  };

  const validatePasswords = (name, value) => {
    let newErrors = { ...errors };
    const currentNewPass = name === "newPassword" ? value : passwordFields.newPassword;
    const currentConfirmPass = name === "confirmPassword" ? value : passwordFields.confirmPassword;

    if (name === "newPassword") {
      if (!value) {
        newErrors.newPassword = "New password is required";
      } else if (value.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters long";
      } else {
        delete newErrors.newPassword;
      }
    }

    if (name === "confirmPassword" || name === "newPassword") {
      if (touched.confirmPassword || name === "confirmPassword") {
        if (!currentConfirmPass) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (currentNewPass !== currentConfirmPass) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
      }
    }

    setErrors(newErrors);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setTouched({ newPassword: true, confirmPassword: true });

    const newErrors = {};
    if (!passwordFields.newPassword) newErrors.newPassword = "New password is required";
    if (passwordFields.newPassword && passwordFields.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }
    if (!passwordFields.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const otpCode = otp.join("");

    try {
      setIsSubmitting(true);
      const payload = {
        email: email.trim(),
        otp: otpCode,
        password: passwordFields.newPassword
      };
      
      await resetPassword(payload);
      setStep("success");
      setErrors({});
    } catch (error) {
      console.error(error);
      const apiMessage = error.response?.data?.message || "Failed to update password. Try again.";
      toast.error(apiMessage);
      
      if (apiMessage.toLowerCase().includes("otp") || apiMessage.toLowerCase().includes("code")) {
        setStep("otp");
        setErrors({ otp: apiMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (step === "sent") {
      return (
        <section className="resetPass_container resetPass_modal">
          <img className="forgotPassImage modalImage" src={codeImg} alt="" />
          <div className="forgotPassHeader">
            <h1>Code sent successfully</h1>
            <p>Check your email for the password reset code.</p>
          </div>
          <button className="forgotPrimaryBtn" onClick={() => setStep("otp")} disabled={isSubmitting}>
            Continue
          </button>
        </section>
      );
    }

    if (step === "otp") {
      return (
        <section className="resetPass_container resetPass_modal modal-relative">
          <button 
            type="button"
            className="modalTopBackBtn"
            onClick={() => {
              setStep("email");
              setOtp(Array(6).fill(""));
              setErrors({});
            }}
            disabled={isSubmitting}
            aria-label="Go back to email entry"
          >
            <ChevronLeft size={22} />
          </button>

          <img className="forgotPassImage modalImage" src={codeImg} alt="" />
          <div className="forgotPassHeader">
            <h1>Enter Verification Code</h1>
            <p>
              We've sent a 6-digit code to your email ({maskedEmail}). Please
              enter it below.
            </p>
          </div>

          <div className="otpInputs" aria-label="Verification code">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  otpRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                onPaste={handleOtpPaste}
                aria-label={`Digit ${index + 1}`}
                className={errors.otp ? "forgot-input-error" : ""}
                disabled={isSubmitting}
              />
            ))}
          </div>
          {errors.otp && <span className="forgot-error-text otp-error">{errors.otp}</span>}

          <button 
            className="forgotPrimaryBtn" 
            onClick={handleOtpSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </button>
        </section>
      );
    }

    if (step === "password") {
      return (
        <section className="resetPass_container resetPass_password">
          <img
            className="forgotPassImage passwordImage"
            src={resetImg}
            alt="Reset password illustration"
          />

          <div className="forgotPassHeader">
            <h1>Reset your password</h1>
          </div>

          <form className="forgotPassForm" onSubmit={handlePasswordSubmit}>
            <label className="forgotEmailField">
              <span>New password</span>
              <div className="forgot-password-wrapper">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  name="newPassword"
                  placeholder="••••••••" 
                  value={passwordFields.newPassword}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  className={touched.newPassword && errors.newPassword ? "forgot-input-error" : ""}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <span className="forgot-error-text">{errors.newPassword}</span>
              )}
            </label>

            <label className="forgotEmailField">
              <span>Re-enter password</span>
              <div className="forgot-password-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  value={passwordFields.confirmPassword}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  className={touched.confirmPassword && errors.confirmPassword ? "forgot-input-error" : ""}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="forgot-error-text">{errors.confirmPassword}</span>
              )}
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Continue"}
            </button>
          </form>
        </section>
      );
    }

    if (step === "success") {
      return (
        <section className="resetPass_container resetPass_modal">
          <img className="forgotPassImage modalImage" src={codeImg} alt="" />
          <div className="forgotPassHeader">
            <h1>Password Reset Successful</h1>
            <p>
              Your password has been updated successfully. You can now log in to
              your account with your new password.
            </p>
          </div>
          <a className="forgotPrimaryBtn" href="/login">
            Continue
          </a>
        </section>
      );
    }

    return (
      <section className="resetPass_container">
        <img
          className="forgotPassImage"
          src={forgetImg}
          alt="Forgot password illustration"
        />

        <div className="forgotPassHeader">
          <h1>Forgot your password?</h1>
          <p>
            Enter your registered email address below and we'll send you a
            verification code to reset your password.
          </p>
        </div>

        <form className="forgotPassForm" onSubmit={handleEmailSubmit}>
          <label className="forgotEmailField">
            <span>Email</span>
            <input
              type="email"
              placeholder="Ajchibuzor@gmail.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              className={touched.email && errors.email ? "forgot-input-error" : ""}
              disabled={isSubmitting}
            />
            {touched.email && errors.email && (
              <span className="forgot-error-text">{errors.email}</span>
            )}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Email"}
          </button>
        </form>

        <a className="backToLogin" href="/login">
          <ChevronLeft size={20} />
          <span>Back to login</span>
        </a>
      </section>
    );
  };

  return <main className="forgotPassPage">{renderStep()}</main>;
};

export default ForgetPassUi;