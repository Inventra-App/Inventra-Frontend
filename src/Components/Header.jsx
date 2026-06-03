import React, { useState } from "react";
import "../Css/Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../assets/Inventra Logo.png'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} className="logo-icon" alt="" />
        <h2>Inventra</h2>
      </div>

      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
        <a href="#features">Features</a>
        <NavLink to="/pricing" className={({ isActive }) => isActive ? "active" : ""}>Pricing</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact Us</NavLink>
      </nav>

      <div className="header-actions">
        <button className="login-btn">Login</button>
        <button className="start-btn" onClick={() => nav("/signup")}>Get Started</button>
      </div>

      <div className="header-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <NavLink to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</NavLink>
          <div className="mobile-menu-actions">
            <button className="login-btn">Login</button>
            <button className="start-btn" onClick={() => nav("/signup")}>Get Started</button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header