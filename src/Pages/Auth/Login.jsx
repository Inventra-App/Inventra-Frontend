import React from "react";
import {
  BarChart3,
  Box,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Shield,
  UsersRound,
} from "lucide-react";
import "./Css/Login.css";

const Login = () => {
  return (
    <main className="loginPage">
      <section className="LoginPage_left">
        <div className="loginOverlay"></div>

        <div className="leftContent">
          <div className="loginLogo">
            <div className="loginLogoBox">
              <Box size={24} />
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
        <div className="loginSignupPrompt">
          <span>Don't have an account?</span>
          <a href="/signup">Get Started</a>
        </div>

        <form className="loginFormCard">
          <div className="loginFormHeading">
            <h2>Welcome Back!</h2>
            <p>Login to your Inventra account</p>
          </div>

          <label className="loginField">
            <span>Email Address</span>
            <input type="email" placeholder="Ajchibuzor@gmail.com" />
          </label>

          <label className="loginField">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <div className="loginOptions">
            <label className="rememberLogin">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button className="loginSubmit" type="submit">
            Login
          </button>

          <div className="loginDivider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <button className="googleLogin" type="button">
            <span className="googleMark" aria-hidden="true">
              <img src="https://www.google.com/favicon.ico" alt="Google" width={25} />j
            </span>
            <span>Google</span>
          </button>

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
