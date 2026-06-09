import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../Components/Header'
import SignUpLeft from '../../SignUp/Components/SignUpLeft'
import SignUpRight from '../../SignUp/Components/SignUpRight'
import './Css/SignUp.css'

const SignUp = () => {
  const nav = useNavigate()

  return (
    <div className="signup-page">
      
      <div className="signup-mobile-header">
        <Header />
      </div>

      <SignUpLeft nav={nav} />

      <SignUpRight nav={nav} />
    </div>
  )
}

export default SignUp