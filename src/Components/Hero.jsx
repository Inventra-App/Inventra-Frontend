import React from "react";
import "../Css/Hero.css";
import { Rocket, Play, CheckCircle } from "lucide-react";
import dashboard from '../assets/Inventra Dashboard.png'
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const nav = useNavigate();

  return (
    <section className="hero">

      <div className="hero-left">
        <div className="hero-badge">
          Smart Inventory, Smarter Operations.
        </div>
        <h1>
          Smart Inventory & <br /> Expiry Management <br /> <span>for Modern</span>
          <span> Supermarkets</span>
        </h1>
        <p>
          Inventra helps supermarkets track inventory in real time,
          manage sales, reduce expiry losses, and improve staff
          accountability all in one powerful platform.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => nav("/signup")}>
            <Rocket size={18} />
            Get Started
          </button>
          <button className="secondary-btn" onClick={() => nav("/demo")}>
            <Play size={18} />
            Book a Demo
          </button>
        </div>

        <div className="hero-right hero-right-mobile">
          <img src={dashboard} className="dashboard-placeholder" alt="" />
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <CheckCircle size={20} />
            <span>Real-time Tracking</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={20} />
            <span>Reduce Losses</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={20} />
            <span>Improve Efficiency</span>
          </div>
        </div>
      </div>

      <div className="hero-right hero-right-desktop">
        <img src={dashboard} className="dashboard-placeholder" alt="" />
      </div>

    </section>
  );
};

export default Hero;