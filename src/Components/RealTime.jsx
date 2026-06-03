import React from 'react'
import '../Css/RealTime.css'
import real from '../assets/Real Time.png'

const RealTime = () => {
  return (
    <div className="realtime-section">
      <div className="realtime-image">
        <img
          src={real}
          alt="Supermarket checkout"
          className="realtime-img"
        />
      </div>

      <div className="realtime-text">
        <h2 className="realtime-title">
          Real-Time Expiry Monitoring Built Into Your Workflow.
        </h2>
        <p className="realtime-desc">
          Inventra automatically monitors product expiry dates and helps your team take action before products expire
        </p>
      </div>

    </div>
  )
}

export default RealTime