import React from 'react'
import logoImg from '../assets/Inventra Logo.png'
import '../Css/Logo.css'

const Logo = ({ variant = 'white' }) => {
  return (
    <div className={`inventra-logo-component ${variant}`}>
      <img src={logoImg} alt="Inventra" className="inventra-logo-img" />
      <span>Inventra</span>
    </div>
  )
}

export default Logo