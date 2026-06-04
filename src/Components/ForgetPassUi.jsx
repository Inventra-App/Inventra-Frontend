import React, { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import forgetImg from "../assets/ForgetImg1.png";
import codeImg from "../assets/ForgetImg2.png";
import resetImg from "../assets/ForgetImg3.png";
import "../Css/ForgetPassUi.css";

const ForgetPassUi = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);

  const maskedEmail = email || "j***@inventra.com";

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setStep("sent");
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
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
          <button className="forgotPrimaryBtn" onClick={() => setStep("otp")}>
            Continue
          </button>
        </section>
      );
    }

    if (step === "otp") {
      return (
        <section className="resetPass_container resetPass_modal">
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
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          <button className="forgotPrimaryBtn" onClick={() => setStep("password")}>
            Continue
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

          <form
            className="forgotPassForm"
            onSubmit={(event) => {
              event.preventDefault();
              setStep("success");
            }}
          >
            <label className="forgotEmailField">
              <span>New password</span>
              <input type="password" placeholder="Ajchibuzor@gmail.com" />
            </label>

            <label className="forgotEmailField">
              <span>Re-enter password</span>
              <input type="password" placeholder="••••••••" />
            </label>

            <button type="submit">Continue</button>
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
              Your password has been updated successfully. you can now log in to
              your account with your new password
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
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button type="submit">Send Email</button>
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
