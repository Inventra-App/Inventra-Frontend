import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../Components/Logo'
import successBadge from '../../assets/Verified.png' 
import './Css/Created.css'

const Created = () => {
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    // navigate('/dashboard')
  }

  return (
    <div className="created-page-container">
      <div className="created-page-header">
        <Logo variant="dark" />
      </div>

      <div className="created-content-wrapper">
        <div className="created-image-section">
          <img src={successBadge} alt="Success Verification" className="created-badge-img" />
        </div>

        <div className="created-text-section">
          <h2>Account Created Successsfully</h2>
          <h3>Welcome to Inventra</h3>
          <p>Your supermarket account has been <br /> created successfully</p>
        </div>

        <div className="created-action-container">
          <button 
            type="button" 
            className="created-dashboard-btn"
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Created