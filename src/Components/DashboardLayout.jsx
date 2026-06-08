import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Package } from 'lucide-react'
import '../Pages/Auth/Css/Dashboard.css'
import SideBar from './SideBar'
import DashboardHeader from './DashboardHeader'

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const navigate = useNavigate()

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const openLogoutModal = () => {
    closeMobileMenu()
    setIsLogoutModalOpen(true)
  }
  const closeLogoutModal = () => setIsLogoutModalOpen(false)
  const confirmLogout = () => {
    setIsLogoutModalOpen(false)
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <div className="desktop-sidebar-wrapper">
        <SideBar onItemClick={() => {}} onLogout={openLogoutModal} />
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
        <SideBar onItemClick={closeMobileMenu} onLogout={openLogoutModal} />
      </div>

      <div className="dashboard-main">
        <div className="desktop-header-wrapper">
          <DashboardHeader />
        </div>
        <Outlet />
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal-backdrop" role="presentation">
          <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
            <div className="logout-modal-icon">
              <LogOut size={28} />
            </div>

            <h2 id="logout-modal-title">Log out Account ?</h2>
            <p>Are you sure you want to logout your account ?</p>

            <div className="logout-modal-actions">
              <button className="logout-cancel-btn" type="button" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="logout-confirm-btn" type="button" onClick={confirmLogout}>
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
