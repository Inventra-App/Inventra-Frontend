import React, { useState, useEffect } from 'react'
import { Package, CalendarCheck, TrendingUp, Shield, Users, Clock } from 'lucide-react'
import logo from '../../assets/Inventra Logo.png'
import bg1 from '../../assets/SignUp bdg.jpg'
import bg2 from '../../assets/Pricing bdg.jpg'
import bg3 from '../../assets/Warehouse.jpg'
import './Css/SignUp.css'
import Header from '../../Components/Header'

const backgrounds = [bg1, bg2, bg3]

const SignUp = () => {
const [currentBg, setCurrentBg] = useState(0)
const [nextBg, setNextBg] = useState(1)
const [fading, setFading] = useState(false)

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

  return (
    <div className="signup-page">

      <div className="signup-mobile-header">
        <Header/>
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
          <h1>Smart Inventory <br />  Management for Modern <br /> Supermarkets</h1>
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

          <form className="signup-form">
            <div className="signup-field">
              <label>First Name</label>
              <input type="text" placeholder="Anthony" />
            </div>
            <div className="signup-field">
              <label>Last Name</label>
              <input type="text" placeholder="Onyema" />
            </div>
            <div className="signup-field">
              <label>Business/Store Name</label>
              <input type="text" placeholder="SuperMart Inc." />
            </div>
            <div className="signup-field">
              <label>Email Address</label>
              <input type="email" placeholder="aonyema512@gmail.com" />
            </div>
            <div className="signup-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="+234 905 672 4944" />
            </div>
            <div className="signup-field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="signup-field">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="signup-agree">
              <input type="checkbox" id="agree" />
              <label htmlFor="agree">
                I agree to the <a href="/terms" className="signup-link">Terms and Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="signup-btn">Create Account</button>
            <div className="signup-divider"><span>or continue with</span></div>
            <button type="button" className="signup-google-btn">
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