import React from 'react'
import '../Css/Button.css'

const Button = (props) => {
  return (
   <button 
      type={props.type || "button"}
      onClick={props.onClick}
      className={`btn ${props.className}`}
      disabled={props.disabled}
      style={props.style}
   >
    {props.text}
   </button>
  )
}

export default Button
