import React from 'react'
import '../Css/BadgeItem.css'

const BadgeItem = ({ icon, label }) => {
  return (
    <div className="all-badge">
      <span className="track-badge-icon">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export default BadgeItem