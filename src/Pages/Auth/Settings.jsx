import React, { useState } from 'react'
import { Bell, Check, Database, Eye, Lock, Save, Shield, User } from 'lucide-react'
import './Css/Settings.css'

const ProfileSettings = () => {
  return (
    <section className='settings-content-card'>
      <h3>Profile Information</h3>
      <p>Update your personal and business information</p>

      <div className='settings-form'>
        <label className='settings-field'>
          <span>Full Name</span>
          <input type='text' defaultValue='Admin User' />
        </label>

        <label className='settings-field'>
          <span>Email Address</span>
          <input type='email' defaultValue='user@example.com' />
        </label>

        <label className='settings-field'>
          <span>Phone Number</span>
          <input type='tel' defaultValue='+234 123 456 7890' />
        </label>

        <label className='settings-field'>
          <span>Business Name</span>
          <input type='text' defaultValue='My Supermarket' />
        </label>

        <label className='settings-field settings-field-full'>
          <span>Business Address</span>
          <textarea></textarea>
        </label>
      </div>

      <button className='settings-save-btn' type='button'>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const NotificationSettings = () => {
  return (
    <section className='settings-content-card settings-notification-card'>
      <h3>Notification Preferences</h3>
      <p>Choose what notifications you want to receive</p>

      <div className='settings-notification-list'>
        <div className='settings-notification-row'>
          <div>
            <h4>Expiry Alerts</h4>
            <p>Get notified when products are approaching expiry</p>
          </div>
          <button className='settings-switch active' type='button'><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Low Stock Alerts</h4>
            <p>Get notified when inventory is running low</p>
          </div>
          <button className='settings-switch active' type='button'><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Sales Notifications</h4>
            <p>Get notified about sales transactions</p>
          </div>
          <button className='settings-switch' type='button'><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Email Notifications</h4>
            <p>Receive notifications via email</p>
          </div>
          <button className='settings-switch active' type='button'><span></span></button>
        </div>
      </div>

      <button className='settings-save-btn' type='button'>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const SecuritySettings = () => {
  return (
    <section className='settings-content-card settings-security-card'>
      <h3>Security Settings</h3>
      <p>Manage your password and security preferences</p>

      <div className='settings-security-form'>
        <label className='settings-field'>
          <span>Current Password</span>
          <div className='settings-password-field'>
            <input type='password' />
            <Eye size={18} />
          </div>
        </label>

        <label className='settings-field'>
          <span>New Password</span>
          <div className='settings-password-field'>
            <input type='password' />
            <Eye size={18} />
          </div>
        </label>

        <label className='settings-field'>
          <span>Confirm New Password</span>
          <input type='password' />
        </label>
      </div>

      <button className='settings-save-btn settings-change-password-btn' type='button'>
        <Shield size={16} />
        <span>Change Password</span>
      </button>
    </section>
  )
}

const SystemSettings = () => {
  return (
    <section className='settings-content-card settings-system-card'>
      <h3>System Preferences</h3>
      <p>Configure system-wide settings</p>

      <div className='settings-form settings-system-form'>
        <label className='settings-field'>
          <span>Currency</span>
          <input type='text' />
        </label>

        <label className='settings-field'>
          <span>Timezone</span>
          <input type='text' />
        </label>

        <label className='settings-field'>
          <span>Date Format</span>
          <input type='text' />
        </label>

        <label className='settings-field'>
          <span>Language</span>
          <input type='text' />
        </label>
      </div>

      <button className='settings-save-btn' type='button'>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const PermissionSettings = () => {
  const managerPermissions = [
    'Dashboard Access',
    'Inventory Access',
    'Manage Inventory',
    'Sales (POS) Access',
    'Goods Receiving Access',
    'Expiry Management Access',
    'Activity Log Access',
    'User Management Access',
    'Settings Access',
  ]

  return (
    <section className='settings-content-card settings-permissions-card'>
      <h3>Permission Management</h3>
      <p>Configure access permissions for different user roles</p>

      <div className='settings-permission-notice'>
        <Shield size={18} />
        <div>
          <h4>Important Notice</h4>
          <p>Changes to permissions will take effect when users log in next time. Admin permissions cannot be modified.</p>
        </div>
      </div>

      <div className='settings-role-card'>
        <div className='settings-role-header'>
          <div className='settings-role-icon'>
            <User size={21} />
          </div>
          <div>
            <h4>Manager Role</h4>
            <p>Store managers and supervisors</p>
          </div>
        </div>

        <div className='settings-permission-grid'>
          {managerPermissions.map((permission) => (
            <div className='settings-permission-row' key={permission}>
              <span>{permission}</span>
              <button className='settings-permission-toggle' type='button' aria-label={`${permission} enabled`}>
                <Check size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className='settings-page'>
      <div className='settings-title'>
        <h2>Settings</h2>
        <p>Manage your account and application preferences</p>
      </div>

      <div className='settings-layout'>
        <aside className='settings-sidebar-card'>
          <button
            type='button'
            className={activeSection === 'profile' ? 'settings-menu-item active' : 'settings-menu-item'}
            onClick={() => setActiveSection('profile')}
          >
            <User size={19} />
            <span>Profile</span>
          </button>

          <button
            type='button'
            className={activeSection === 'notifications' ? 'settings-menu-item active' : 'settings-menu-item'}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell size={19} />
            <span>Notifications</span>
          </button>

          <button
            type='button'
            className={activeSection === 'security' ? 'settings-menu-item active' : 'settings-menu-item'}
            onClick={() => setActiveSection('security')}
          >
            <Shield size={19} />
            <span>Security</span>
          </button>

          <button
            type='button'
            className={activeSection === 'system' ? 'settings-menu-item active' : 'settings-menu-item'}
            onClick={() => setActiveSection('system')}
          >
            <Database size={19} />
            <span>System</span>
          </button>

          <button
            type='button'
            className={activeSection === 'permissions' ? 'settings-menu-item active' : 'settings-menu-item'}
            onClick={() => setActiveSection('permissions')}
          >
            <Lock size={19} />
            <span>Permissions</span>
          </button>
        </aside>

        {activeSection === 'profile' && <ProfileSettings />}
        {activeSection === 'notifications' && <NotificationSettings />}
        {activeSection === 'security' && <SecuritySettings />}
        {activeSection === 'system' && <SystemSettings />}
        {activeSection === 'permissions' && <PermissionSettings />}
      </div>
    </div>
  )
}

export default Settings
