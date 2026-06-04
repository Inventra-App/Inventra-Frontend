import React from 'react'
import '../Css/DashboardHeader.css'

const DashboardHeader = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="dash-header">
      <span className="dash-header-date">{today}</span>
    </div>
  )
}

export default DashboardHeader