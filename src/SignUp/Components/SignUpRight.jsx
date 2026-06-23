import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { signupSchema } from "../../Schemas/auth";
import { signupAdmin } from "../../API/authApi";
import { contWithGoogle } from "../../API/googleAuthApi";
import { setRegistrationEmail } from "../../redux/apiSlice";
import { getAccountPath, saveSessionUser } from "../../Utils/sessionUser";
import "../Style/SignUpRight.css";

const SignUpRight = ({ nav }) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      businessName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const withValidation = (name) => {
    const { onChange, onBlur, ...rest } = register(name);

    return {
      ...rest,
      onChange,
      onBlur,
    };
  };

  const showError = (field) => {
    return errors[field];
  };

  const onSubmit = async (data) => {
    if (!data.agree) {
      setError("agree", {
        type: "manual",
        message: "You must agree to Terms and Conditions",
      });
      return;
    }

    try {
      const backendPayload = { ...data };
      delete backendPayload.agree;

      const response = await signupAdmin(backendPayload);

      saveSessionUser(response, backendPayload, { isNewUser: true });
      dispatch(setRegistrationEmail(data.email));

      toast.success(
        response?.message || "Welcome to Inventra! Check your email for OTP."
      );

      nav("/signupverify");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const nameKeyDown = (e) => {
    const allowed = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      " ",
    ];
    if (!allowed.includes(e.key) && !/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const phoneKeyDown = (e) => {
    const allowed = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
    ];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="signup-right">
      <div className="signup-right-top">
        <span>Already have an account?</span>
        <a href="/login" className="signup-login-link">
          Login
        </a>
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
              {...withValidation("firstName")}
              onKeyDown={nameKeyDown}
            />
            {showError("firstName") && (
              <span className="signup-error-text">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Azubuike"
              {...withValidation("lastName")}
              onKeyDown={nameKeyDown}
            />
            {showError("lastName") && (
              <span className="signup-error-text">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Business Name</label>
            <input
              type="text"
              placeholder="SuperMart Inc."
              {...withValidation("businessName")}
            />
            {showError("businessName") && (
              <span className="signup-error-text">
                {errors.businessName.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Email</label>
            <input
              type="text"
              placeholder="email@gmail.com"
              {...withValidation("email")}
            />
            {showError("email") && (
              <span className="signup-error-text">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="08012345678"
              maxLength={11}
              {...withValidation("phoneNumber")}
              onKeyDown={phoneKeyDown}
            />
            {showError("phoneNumber") && (
              <span className="signup-error-text">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Password</label>
            <div className="signup-password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...withValidation("password")}
              />
              <button
                type="button"
                className="signup-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showError("password") && (
              <span className="signup-error-text">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="signup-field">
            <label>Confirm Password</label>
            <div className="signup-password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...withValidation("confirmPassword")}
              />
              <button
                type="button"
                className="signup-password-toggle-btn"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showError("confirmPassword") && (
              <span className="signup-error-text">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="signup-agree-wrapper">
            <div className="signup-agree">
              <input
                type="checkbox"
                id="agree"
                className="signup-agree-checkbox"
                {...register("agree")}
              />
              <label htmlFor="agree">
                I agree to Terms and Conditions
              </label>
            </div>

            {errors.agree && (
              <span className="signup-error-text">
                {errors.agree.message}
              </span>
            )}
          </div>

          <button type="submit" className="signup-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SignUpRight;