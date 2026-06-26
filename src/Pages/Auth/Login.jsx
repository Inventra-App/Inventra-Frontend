import { useEffect, useState } from "react";
import {
  BarChart3,
  Box,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Shield,
  UsersRound,
  Eye,
  EyeOff,
} from "lucide-react";
import logo from "../../assets/Logo 2.png";
import "./Css/Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { loginAdmin } from "../../API/authApi";
import { loginStaff } from "../../API/userManagementAPI";
import { getUserProfile } from "../../API/userProfileApi";
import { setAccessToken, setUser } from "../../redux/apiSlice";
import { getAccountPath, saveSessionUser } from "../../Utils/sessionUser";
import { consumeSessionExpiredMessage } from "../../Utils/authSession";
import { persistUserProfile } from "../../Utils/userProfileState";

const getAuthToken = (response) =>
  response?.token ||
  response?.accessToken ||
  response?.data?.token ||
  response?.data?.accessToken ||
  response?.staff?.token ||
  response?.user?.token ||
  "";

const getResponseRole = (response, fallbackRole) =>
  response?.staff?.role ||
  response?.user?.role ||
  response?.data?.staff?.role ||
  response?.data?.user?.role ||
  response?.data?.role ||
  response?.role ||
  fallbackRole;

const loginWithAdminOrStaff = async (payload) => {
  let adminError;
  let staffError;

  try {
    const response = await loginAdmin(payload);
    return { response, role: getResponseRole(response, "Admin") };
  } catch (err) {
    adminError = err;
  }

  try {
    const response = await loginStaff(payload);
    return { response, role: getResponseRole(response, "Staff") };
  } catch (err) {
    staffError = err;
  }

  throw staffError?.response ? staffError : adminError;
};

const Login = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const message = consumeSessionExpiredMessage();
    if (message) toast.error(message);
  }, []);

  // const validateField = (name, value) => {
  //   let error = "";
  //   if (name === "email") {
  //     if (!value.trim()) {
  //       error = "Email address is required";
  //     } else if (!/\S+@\S+\.\S+/.test(value)) {
  //       error = "Please enter a valid email address";
  //     }
  //   }
  //   if (name === "password" && !value) {
  //     error = "Password is required";
  //   }
  //   setErrors((prev) => ({ ...prev, [name]: error }));
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (!formData[name]?.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          name === "email"
            ? "Email address is required"
            : "Password is required",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("=== LOGIN REQUEST ===", { email: payload.email });
      const { response: res, role: loginRole } =
        await loginWithAdminOrStaff(payload);
      console.log("=== LOGIN SUCCESS ===", res);

      const token = getAuthToken(res);
      if (token) {
        localStorage.setItem("inventra_token", token);
        dispatch(setAccessToken(token));
      }
      let sessionUser = saveSessionUser(res, {
        email: payload.email,
        role: loginRole,
      });
      dispatch(setUser(sessionUser));

      try {
        const profileResponse = await getUserProfile();
        sessionUser = persistUserProfile(profileResponse, dispatch).sessionUser;
      } catch (profileError) {
        console.error("Profile fetch after login failed:", profileError);
      }

      toast.success(res.message || "Login Successful");

      setIsLoggingIn(true);
      setTimeout(() => {
        nav(getAccountPath("/dashboard", sessionUser));
      }, 1000);
    } catch (error) {
      console.error("=== LOGIN ERROR ===", error);

      if (
        !error.response &&
        (error.code === "ERR_NETWORK" || error.message === "Network Error")
      ) {
        toast.error(
          "No internet connection. Please check your network and try again.",
        );
        return;
      }

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";

      toast.error(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggingIn) {
    return (
      <main className="loginLoadingPage" aria-label="Logging in">
        <div className="loginLoader"></div>
      </main>
    );
  }

  return (
    <main className="loginPage">
      <section className="LoginPage_left">
        <div className="loginOverlay"></div>

        <div className="leftContent">
          <div className="loginLogo" onClick={() => nav("/")}>
            <div className="loginLogoBox">
              <img src={logo} alt="logo" />
            </div>
            <h2>Inventra</h2>
          </div>

          <div className="heroText">
            <h1>
              Welcome Back to <br /> Inventra
            </h1>
            <p>
              Access your dashboard and manage inventory, sales, and operations
              in one centralized platform.
            </p>
          </div>

          <div className="loginFeatures">
            <div className="loginFeatureCard">
              <div className="loginIconBox">
                <BarChart3 size={25} />
              </div>
              <div>
                <h3>Real-time Insights</h3>
                <p>
                  Access live data and analytics to make informed decisions
                  instantly.
                </p>
              </div>
            </div>

            <div className="loginFeatureCard">
              <div className="loginIconBox">
                <Shield size={25} />
              </div>
              <div>
                <h3>Secure & Reliable</h3>
                <p>
                  Enterprise-grade security with encrypted data storage and
                  backups.
                </p>
              </div>
            </div>

            <div className="loginFeatureCard">
              <div className="loginIconBox">
                <UsersRound size={25} />
              </div>
              <div>
                <h3>Team Management</h3>
                <p>
                  Collaborate with your team and manage roles and permissions
                  seamlessly.
                </p>
              </div>
            </div>
          </div>

          <div className="bottomInfo">
            <span>
              <LockKeyhole size={17} /> Secure Login
            </span>
            <span>
              <CheckCircle2 size={17} /> Data Protected
            </span>
            <span>
              <Clock3 size={17} /> 24/7 Support
            </span>
          </div>
        </div>
      </section>

      <section className="LoginPage_right">
        <div className="mobileLoginHeader">
          <a href="/" className="mobileLoginBrand">
            <span>
              <Box size={14} />
            </span>
            <strong>Inventra</strong>
          </a>
        </div>

        <div className="loginSignupPrompt">
          <span>Don't have an account?</span>
          <a href="/signup">Get Started</a>
        </div>

        <form className="loginFormCard" onSubmit={handleSubmit}>
          <div className="loginFormHeading">
            <h2>Welcome Back!</h2>
            <p>Login to your Inventra account</p>
          </div>

          <div className="loginField">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              placeholder="Ajchibuzor@gmail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.email && errors.email ? "login-input-error" : ""
              }
              disabled={isSubmitting}
            />
            {touched.email && errors.email && (
              <span className="login-error-text">{errors.email}</span>
            )}
          </div>

          <div className="loginField">
            <span>Password</span>
            <div className="login-password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  touched.password && errors.password ? "login-input-error" : ""
                }
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="login-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="login-error-text">{errors.password}</span>
            )}
          </div>

          <div className="loginOptions">
            {/* <label className="rememberLogin">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>Remember Me</span>
            </label> */}
            <a href="/resetpassword">Forgot Password?</a>
          </div>

          <button className="loginSubmit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* <div className="loginDivider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button
            className={`googleLogin ${isGoogleLoading ? "googleLoginLoading" : ""}`}
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="googleButtonLoader" aria-label="Loading"></span>
            ) : (
              <>
                <span className="googleMark" aria-hidden="true">
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    width={18}
                  />
                </span>
                <span>Google</span>
              </>
            )}
          </button> */}

          <div className="formRule"></div>

          <div className="formTrustInfo">
            <span>
              <LockKeyhole size={14} /> Secure Login
            </span>
            <span>
              <CheckCircle2 size={14} /> Data Protected
            </span>
            <span>
              <Clock3 size={14} /> 24/7 Support
            </span>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
