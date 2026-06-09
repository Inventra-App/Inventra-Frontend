import React from 'react'
import { useLocation } from 'react-router-dom'
import '../Css/DashboardHeader.css'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/sales': 'Sales (POS)',
  '/expiry': 'Expiry Management',
  '/activity': 'Activity Log',
  '/users': 'User Management',
  '/settings': 'Settings',
}

const DashboardHeader = () => {
  const { pathname } = useLocation()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="dash-header">
      {/* <h1>{pageTitles[pathname] || 'Inventra'}</h1> */}
      <span className="dash-header-date">{today}</span>
    </div>
  )
}

export default DashboardHeader
