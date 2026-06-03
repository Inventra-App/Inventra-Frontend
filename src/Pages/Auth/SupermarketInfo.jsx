import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../Components/Logo'
import './Css/SupermarketInfo.css'

const SupermarketInfo = () => {
  const navigate = useNavigate()

  const handleContinue = (e) => {
    e.preventDefault()
    navigate('/setting-up')
  }

  return (
    <div className="info-page-container">
      <div className="info-page-header">
        <Logo variant="white" />
      </div>

      <div className="info-modal-wrapper">
        <h2 className="info-main-title">Welcome to Inventra</h2>
        <p className="info-subtitle">Lets set up your supermarket in a few quick steps</p>
        
        <div className="info-card">
          <h3>Supermarket Information</h3>
          
          <form onSubmit={handleContinue}>
            <div className="info-field">
              <label>Supermarket Name</label>
              <input 
                type="text" 
                placeholder="Enter supermarket name" 
                required 
              />
            </div>

            <div className="info-field">
              <label>Business Type</label>
              <div className="info-select-wrapper">
                <select defaultValue="" required>
                  <option value="" disabled hidden>Enter supermarket type</option>
                  <option value="retail">Retail Supermarket</option>
                  <option value="wholesale">Wholesale Outlet</option>
                  <option value="grocery">Grocery Store</option>
                </select>
              </div>
            </div>

            <div className="info-actions">
              <button 
                type="button" 
                className="info-btn-back" 
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="info-btn-continue"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SupermarketInfo