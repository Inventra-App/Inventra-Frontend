import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, AlertTriangle, ClipboardList, Users, Settings, LogOut } from 'lucide-react'
import Logo from './Logo'
import '../Css/SideBar.css'

const navItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
  { path: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales (POS)' },
  { path: '/expiry', icon: <AlertTriangle size={20} />, label: 'Expiry Management' },
  { path: '/activity', icon: <ClipboardList size={20} />, label: 'Activity Log' },
  { path: '/users', icon: <Users size={20} />, label: 'User Management' },
  { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
]

const SideBar = ({ onItemClick, onLogout }) => {
  const { accountId } = useParams()
  const basePath = accountId ? `/${accountId}` : ''

  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        <Logo variant="white" />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}${item.path}`}
            onClick={onItemClick}
            className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item sidebar-logout" type="button" onClick={onLogout}>
          <span className="sidebar-icon"><LogOut size={20} /></span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>

    </div>
  )
}

export default SideBar
