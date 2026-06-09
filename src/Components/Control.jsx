import React from 'react'
import controlImage from '../assets/Control.png'
import '../Css/Control.css'
import { useNavigate } from 'react-router-dom'

const Control = () => {
  const nav = useNavigate();
  return (
    <div className="control-section">

      <div className="control-left">
        <h2 className="control-title">
          Take Control of inventory, Sales, and Expiry Management
        </h2>
        <p className="control-desc">
          Simplify supermarket operation with real-time inventory tracking, smart expiry
          alerts, and seamless sales management- all in one platform.
        </p>

        <button className="control-btn control-btn-desktop" onClick={() => nav("/pricing")}>See our Pricing</button>
      </div>

      <div className="control-right">
        <img src={controlImage} alt="Control" className="control-img" />
      </div>

      <button className="control-btn control-btn-mobile" onClick={() => nav("/pricing")}>See our Pricing</button>

    </div>
  )
}

export default Control