import React, { useState, useEffect } from 'react'
import { Package, Calendar, TrendingUp, Shield, Users, Clock } from 'lucide-react'
import bg1 from '../../assets/SignUp bdg.jpg'
import bg2 from '../../assets/Pricing bdg.jpg'
import bg3 from '../../assets/Warehouse.jpg'
import logo from '../../assets/Logo 2.png'
import '../Style/SignUpLeft.css'

const backgrounds = [bg1, bg2, bg3]

const SignUpLeft = ({ nav }) => {
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

      <div className="signup-left-logo" onClick={() => nav('/')}>
        <img src={logo} alt="Logo" />
        <span>Inventra</span>
      </div>

      <div className="signup-left-content">
        <h1>Smart Inventory <br /> Management for Modern <br /> Supermarkets</h1>
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
            <div className="signup-feature-icon"><Calendar size={20} /></div>
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
  )
}

export default SignUpLeft
