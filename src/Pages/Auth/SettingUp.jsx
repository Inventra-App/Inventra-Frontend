import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../Components/Logo'
import setupIllustration from '../../assets/Setting pic.png' 
import './Css/SettingUp.css'

const SettingUp = () => {
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsCompleted(true)
          }, 300)
          return 100
        }
        const nextProgress = prev + Math.floor(Math.random() * 5) + 2
        return nextProgress > 100 ? 100 : nextProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const handleContinue = () => {
    navigate('/created') 
  }

  return (
    <div className="setup-page-container">
      <div className="setup-page-header">
        <Logo variant="dark" />
      </div>

      <div className="setup-content-wrapper">
        <div className="setup-image-section">
          <img src={setupIllustration} alt="Setting up workspace" className="setup-vector-img" />
        </div>

        <div className="setup-text-section">
          <h2>Setting up your account</h2>
          <p>This will only take a few seconds</p>
        </div>

        <div className="setup-action-container">
          {!isCompleted ? (
            <div className="setup-loading-box">
              <div className="setup-progress-track">
                <div 
                  className="setup-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="setup-progress-percentage">{progress}%</div>
            </div>
          ) : (
            <button 
              type="button" 
              className="setup-continue-btn"
              onClick={handleContinue}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingUp