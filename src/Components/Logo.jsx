import React from 'react'
import logo from '../assets/Logo 2.png'
import '../Css/Logo.css'

const Logo = ({ variant = 'white' }) => {
  return (
    <div className={`inventra-logo-component ${variant}`}>
      <img className="inventra-logo-img" src={logo} alt="Logo" />
      <span>Inventra</span>
    </div>
  )
}

export default Logo
