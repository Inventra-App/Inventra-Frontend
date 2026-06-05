import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Package } from 'lucide-react'
import '../Pages/Auth/Css/Dashboard.css'
import SideBar from './SideBar'
import DashboardHeader from './DashboardHeader'

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="dashboard-page">
      <div className="desktop-sidebar-wrapper">
        <SideBar onItemClick={() => {}} />
      </div>

      <div className={`mobile-navigation-bar ${isMobileMenuOpen ? 'nav-hidden-state' : ''}`}>
        <div className="mobile-brand-emblem">
          <div className="brand-logo-square">
            <Package size={20} color="white" />
          </div>
          <span className="brand-logo-text">Inventra</span>
        </div>
        <button 
          className="mobile-hamburger-trigger" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-sidebar-backdrop ${isMobileMenuOpen ? 'backdrop-active' : ''}`} onClick={closeMobileMenu} />
      <div className={`mobile-sidebar-drawer ${isMobileMenuOpen ? 'drawer-active' : ''}`}>
        <button className="mobile-drawer-close" onClick={closeMobileMenu}>×</button>
        <SideBar onItemClick={closeMobileMenu} />
      </div>

      <div className="dashboard-main">
        <div className="desktop-header-wrapper">
          <DashboardHeader />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout