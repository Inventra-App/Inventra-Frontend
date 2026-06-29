import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginStaff } from "../API/userManagementAPI";
import { getAccountPath, saveSessionUser } from "../Utils/sessionUser";
import {
  getRoleFromToken,
  getStaffLoginDestination,
  normalizeRole,
} from "../Utils/authRoles";
import {
  clearAuthStorage,
  consumeSessionExpiredMessage,
} from "../Utils/authSession";
import Logo from "./Logo";
import loginBg from "../assets/LoginBg.png";
import "./CashierLogin.css";

const getAuthToken = (response) =>
  response?.token ||
  response?.accessToken ||
  response?.data?.token ||
  response?.data?.accessToken ||
  response?.data?.staff?.token ||
  response?.staff?.token ||
  response?.user?.token ||
  "";

const getResponseRole = (response) =>
  response?.staff?.role ||
  response?.user?.role ||
  response?.data?.staff?.role ||
  response?.data?.user?.role ||
  response?.data?.role ||
  response?.role ||
  "";

const CashierLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const message = consumeSessionExpiredMessage();
    if (message) toast.error(message);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!formData.email.trim() || !formData.password) {
      toast.error("Gmail address and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };
      const response = await loginStaff(payload);
      const token = getAuthToken(response);
      const tokenRole =
        getRoleFromToken(token) || normalizeRole(getResponseRole(response));

      if (tokenRole !== "Cashier") {
        toast.error("Only cashier staff accounts can sign in here.");
        return;
      }
      clearAuthStorage();

      if (token) {
        localStorage.setItem("inventra_token", token);
      }

      const sessionUser = saveSessionUser(response, {
        email: payload.email,
        role: tokenRole,
      });

      toast.success(response?.message || "Cashier login successful");
      navigate(
        getAccountPath(getStaffLoginDestination(tokenRole), sessionUser),
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="staff-auth-page">
      <section
        className="staff-auth-visual"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="staff-auth-shade" />
        <div className="staff-auth-brand" onClick={() => navigate("/")}>
          <Logo variant="white" />
        </div>

        <div className="staff-auth-copy">
          <h1>Smart Inventory, Simplified.</h1>
          <p>
            Your all-in-one platform for managing products, tracking expiry
            stock, and processing sales.
          </p>
        </div>

        <p className="staff-auth-footer">
          (c) 2026 INVENTRA. All rights reserved.
        </p>
      </section>

      <section className="staff-auth-form-section">
        <form className="staff-auth-form" onSubmit={handleSubmit}>
          <div className="staff-auth-heading">
            <h2>Welcome back</h2>
            <p>Sign in with your admin-assigned Gmail account</p>
          </div>

          <div className="staff-auth-switch" aria-label="Login type">
            <button type="button" onClick={() => navigate("/staff-login")}>
              Manager
            </button>
            <button type="button" className="active" aria-current="page">
              Cashier
            </button>
          </div>

          <label className="staff-auth-field">
            <span>Gmail Address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="cashier@yourstore.com"
              disabled={isSubmitting}
            />
          </label>

          <label className="staff-auth-field">
            <span className="staff-auth-password-label">Password</span>
            <div className="staff-auth-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button
            className="staff-auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in as Cashier"}
          </button>

          <p className="staff-auth-note">
            Account access is managed by your store administrator.
          </p>
        </form>
      </section>
    </main>
  );
};

export default CashierLogin;
