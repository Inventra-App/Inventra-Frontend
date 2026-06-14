import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import '../Pages/Auth/Css/Dashboard.css'
import SideBar from './SideBar'
import DashboardHeader from './DashboardHeader'
import { logoutUser } from '../API/logoutUser'

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const openLogoutModal = () => {
    closeMobileMenu()
    setIsLogoutModalOpen(true)
  }
  const closeLogoutModal = () => setIsLogoutModalOpen(false)

  // Called when the user clicks "Logout" in the confirmation modal.
  // `logoutUser` already:
  //   - POSTs to /logout
  //   - removes every known token from localStorage
  //   - resets redux auth + user-scoped data
  // So this handler just needs to handle UX (toast + navigation).
  const confirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logoutUser();
      toast.success("You've been logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      // logoutUser still ran its local cleanup via finally, so the user
      // is safely signed-out client-side. We still show feedback.
      toast.success("Logged out locally (server was unreachable).");
    } finally {
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

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
              <button
                className="logout-cancel-btn"
                type="button"
                onClick={closeLogoutModal}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                className="logout-confirm-btn"
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={17} />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
