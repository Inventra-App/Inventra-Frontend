import React from 'react'
import logo from '../assets/Inventra Logo.png'
import '../Css/Footer.css'

const Footer = () => {
  return (
    <div className="footer-section">

      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Inventra" className="footer-logo-img" />
            <span className="footer-logo-text">Inventra</span>
          </div>
          <p className="footer-brand-desc">
            Inventra is an all in one inventory and expiry management platform designed
            to help supermarkets track stock in real time, manage sales operations,
            reduce products losses and improve overall business efficiency through
            smarter operational management.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Products</h4>
          <ul className="footer-col-list">
            <li>Marketplace</li>
            <li>Business</li>
            <li>POS</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Policies</h4>
          <ul className="footer-col-list">
            <li>Term & Condition</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-col-list">
            <li>Help & Center</li>
            <li>Video Tutorials</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-col-list">
            <li>Thecurveafrica.com</li>
            <li>Thecurveafrica</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Inventra. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer