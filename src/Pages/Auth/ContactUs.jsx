import React, { useState } from 'react'
import './Css/ContactUs.css'
import Header from '../../Components/Header'
import Footer from "../../Components/Footer"
import phone from "../../assets/phone.png"
import { useNavigate } from 'react-router-dom'
import { sendFeedBack } from '../../API/countactUsApi'

const ContactUs = () => {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  // UI state for the API call
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const nav = useNavigate();

  // Reset messages (used when the user starts typing again)
  const clearMessages = () => {
    setSuccessMsg("");
    setErrorMsg("");
    setFieldErrors({});
  };

  // Simple validation: returns an object of errors.
  // Empty object means everything is okay.
  const validateForm = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }

    if (!message.trim()) {
      errors.message = "Message is required";
    }

    if (!agreed) {
      errors.agreed = "You must agree to the privacy policy";
    }

    return errors;
  };

  // Called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    // 1) Validate locally first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // 2) Build the payload and call the API
    const payload = { firstName, email, phoneNumber, message };
    setIsLoading(true);

    try {
      const response = await sendFeedBack(payload);

      // 3) Success — confirm to the user and reset the form
      console.log("Contact-us response:", response);
      setSuccessMsg("Message sent successfully. We'll get back to you soon!");
      setFirstName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      setAgreed(false);
    } catch (error) {
      // 4) Failure — show a friendly error message
      console.error("Contact-us error:", error);

      // 4a) Backend replied with an error (4xx / 5xx)
      if (error?.response) {
        const backendMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server responded with ${error.response.status}. Please try again.`;
        setErrorMsg(backendMessage);
      }
      // 4b) Request was sent but timed out (server slow / waking up)
      else if (error?.code === "ECONNABORTED") {
        setErrorMsg(
          "The server is taking too long to respond. It may be waking up — please wait a moment and try again."
        );
      }
      // 4c) Network / browser-level failure (no response at all)
      else {
        setErrorMsg(
          "Could not reach the server. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header/>
      <section className='contact-container'>
        <article className='contactus'>
          <div className='contactext-container'>
            <h3 className='contacth3'>Contact <span>Us</span></h3>
            <p className='contactp'>We are here to help! whether you have question, feedback, or
need support, our team is ready to assist you </p>
          </div>

          {/* Success / error banners */}
          {successMsg && <div className="contact-success">{successMsg}</div>}
          {errorMsg && <div className="contact-error">{errorMsg}</div>}

          <form className='contact-form' onSubmit={handleSubmit} noValidate>
            <label className='contact-field'>
              <span>First Name</span>
              <input
                type='text'
                placeholder='Chibuzor'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearMessages();
                }}
                className={fieldErrors.firstName ? "input-error" : ""}
                disabled={isLoading}
              />
              {fieldErrors.firstName && (
                <small className="field-error">{fieldErrors.firstName}</small>
              )}
            </label>

            <label className='contact-field'>
              <span>Email</span>
              <input
                type='email'
                placeholder='you@company.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearMessages();
                }}
                className={fieldErrors.email ? "input-error" : ""}
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <small className="field-error">{fieldErrors.email}</small>
              )}
            </label>

            <label className='contact-field'>
              <span>Phone Number</span>
              <input
                type='tel'
                placeholder='+234'
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  clearMessages();
                }}
                className={fieldErrors.phoneNumber ? "input-error" : ""}
                disabled={isLoading}
              />
              {fieldErrors.phoneNumber && (
                <small className="field-error">{fieldErrors.phoneNumber}</small>
              )}
            </label>

            <label className='contact-field'>
              <span>Message</span>
              <textarea
                placeholder='Leave us a message...'
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  clearMessages();
                }}
                className={fieldErrors.message ? "input-error" : ""}
                disabled={isLoading}
              ></textarea>
              {fieldErrors.message && (
                <small className="field-error">{fieldErrors.message}</small>
              )}
            </label>

            <label className='privacy-check'>
              <input
                type='checkbox'
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  clearMessages();
                }}
                disabled={isLoading}
              />
              <span>i agree with your friendly <u>privacy policy</u></span>
            </label>
            {fieldErrors.agreed && (
              <small className="field-error">{fieldErrors.agreed}</small>
            )}

            <button type='submit' className='contact-submit' disabled={isLoading}>
              {isLoading ? "Sending..." : "Send message"}
            </button>
          </form>

          <section className='contact-info'>
            <h3 className='contact-info h3'>Get in touch</h3>

            <div className='contact-info-item'>
              <p>Email:</p>
              <a href='mailto:admin@the-curve-.africa'>admin@the-curve-.africa</a>
            </div>

            <div className='contact-info-item'>
              <p>Phone:</p>
              <a href='tel:09069273334'>09069273334</a>
            </div>

            <div className='contact-info-item'>
              <p>Address:</p>
              <address>161/162 Muyili Street, Olodi<br />Apapa, Lagos</address>
            </div>
          </section>

          <div className='contact-content'>
            <div className='content-right'>
              <h3 className='get-touch'>Get in touch</h3>
              <div className='email-holder'>
                <div className='email-text1'>
                  <p>Email:</p>
                  <span className='spa'>admin@the-curve-.africa</span>
                </div>

                <div className='email-text2'>
                  <p>phone:</p>
                  <span className='spa'>09069273334</span>
                </div>

                <div className='email-text3'>
                  <p>Address:</p>
                  <span className='spa'>161/162 Muyili Street, Olodi <br />Apapa, Lagos</span>
                </div>
              </div>
            </div>
            <form className='content-left contact-side-form' onSubmit={handleSubmit} noValidate>
              <label className='contact-field'>
                <span>First Name</span>
                <input
                  type='text'
                  placeholder='Chibuzor'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearMessages();
                  }}
                  className={fieldErrors.firstName ? "input-error" : ""}
                  disabled={isLoading}
                />
                {fieldErrors.firstName && (
                  <small className="field-error">{fieldErrors.firstName}</small>
                )}
              </label>

              <label className='contact-field'>
                <span>Email</span>
                <input
                  type='email'
                  placeholder='you@company.com'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearMessages();
                  }}
                  className={fieldErrors.email ? "input-error" : ""}
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <small className="field-error">{fieldErrors.email}</small>
                )}
              </label>

              <label className='contact-field'>
                <span>Phone Number</span>
                <input
                  type='tel'
                  placeholder='+234'
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    clearMessages();
                  }}
                  className={fieldErrors.phoneNumber ? "input-error" : ""}
                  disabled={isLoading}
                />
                {fieldErrors.phoneNumber && (
                  <small className="field-error">{fieldErrors.phoneNumber}</small>
                )}
              </label>

              <label className='contact-field'>
                <span>Message</span>
                <textarea
                  placeholder='Leave us a message...'
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearMessages();
                  }}
                  className={fieldErrors.message ? "input-error" : ""}
                  disabled={isLoading}
                ></textarea>
                {fieldErrors.message && (
                  <small className="field-error">{fieldErrors.message}</small>
                )}
              </label>

              <label className='privacy-check'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    clearMessages();
                  }}
                  disabled={isLoading}
                />
                <span>i agree with your friendly <u>privacy policy</u></span>
              </label>
              {fieldErrors.agreed && (
                <small className="field-error">{fieldErrors.agreed}</small>
              )}

              <button type='submit' className='contact-submit' disabled={isLoading}>
                {isLoading ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </article>

        <section className='contact'>
          <article className='contact2'>
            <div className='contact3'>
              <div className='smater'>
                <nav className='smater-text'>Smarter Inventory starts <br />
with Inventra</nav>
<nav className='smater-text-container'>
  <div className='smarter-text1'>We help supermarkets manage inventory, track expiry, <br />
monitor sales , and improve daily operations through <br />
one smart and efficient platform</div>
</nav>
<button className='smarter-btn' onClick={() => nav("/signup")}>Get Started</button>
              </div>
              <img src={phone} alt=""  className='phone'/>
            </div>
          </article>
        </section>
      </section>
      <Footer/>
    </div>
  )
}

export default ContactUs
