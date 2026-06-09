import React, { useEffect, useState } from 'react'
import { Bell, Check, Database, Eye, Save, Shield, User } from 'lucide-react'
import './Css/Settings.css'

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const FieldError = ({ message }) => {
  if (!message) return null
  return <small className='settings-error-text'>{message}</small>
}

const SaveSuccessPopup = ({ message }) => {
  return (
    <div className='settings-success-backdrop'>
      <div className='settings-success-popup'>
        <span className='settings-success-icon'>
          <Check size={16} />
        </span>
        <p>{message}</p>
      </div>
    </div>
  )
}

const ProfileSettings = ({ onSave }) => {
  const [form, setForm] = useState({
    fullName: 'Admin User',
    email: 'user@example.com',
    phone: '+234 123 456 7890',
    businessName: 'My Supermarket',
    businessAddress: '',
  })
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSave = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required'
    if (!form.email.trim()) nextErrors.email = 'Email address is required'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required'
    if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave()
  }

  return (
    <section className='settings-content-card'>
      <h3>Profile Information</h3>
      <p>Update your personal and business information</p>

      <div className='settings-form'>
        <label className='settings-field'>
          <span>Full Name</span>
          <input type='text' value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
          <FieldError message={errors.fullName} />
        </label>

        <label className='settings-field'>
          <span>Email Address</span>
          <input type='email' value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          <FieldError message={errors.email} />
        </label>

        <label className='settings-field'>
          <span>Phone Number</span>
          <input type='tel' value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          <FieldError message={errors.phone} />
        </label>

        <label className='settings-field'>
          <span>Business Name</span>
          <input type='text' value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} />
          <FieldError message={errors.businessName} />
        </label>

        <label className='settings-field settings-field-full'>
          <span>Business Address</span>
          <textarea value={form.businessAddress} onChange={(event) => updateField('businessAddress', event.target.value)}></textarea>
        </label>
      </div>

      <button className='settings-save-btn' type='button' onClick={handleSave}>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const NotificationSettings = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    expiry: true,
    lowStock: true,
    sales: false,
    email: true,
  })

  const togglePreference = (name) => {
    setPreferences((current) => ({ ...current, [name]: !current[name] }))
  }

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
          <button className={preferences.expiry ? 'settings-switch active' : 'settings-switch'} type='button' onClick={() => togglePreference('expiry')}><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Low Stock Alerts</h4>
            <p>Get notified when inventory is running low</p>
          </div>
          <button className={preferences.lowStock ? 'settings-switch active' : 'settings-switch'} type='button' onClick={() => togglePreference('lowStock')}><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Sales Notifications</h4>
            <p>Get notified about sales transactions</p>
          </div>
          <button className={preferences.sales ? 'settings-switch active' : 'settings-switch'} type='button' onClick={() => togglePreference('sales')}><span></span></button>
        </div>

        <div className='settings-notification-row'>
          <div>
            <h4>Email Notifications</h4>
            <p>Receive notifications via email</p>
          </div>
          <button className={preferences.email ? 'settings-switch active' : 'settings-switch'} type='button' onClick={() => togglePreference('email')}><span></span></button>
        </div>
      </div>

      <button className='settings-save-btn' type='button' onClick={onSave}>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const SecuritySettings = ({ onSave }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSave = () => {
    const nextErrors = {}

    if (!form.currentPassword) nextErrors.currentPassword = 'Current password is required'
    if (!form.newPassword) nextErrors.newPassword = 'New password is required'
    else if (form.newPassword.length < 6) nextErrors.newPassword = 'Password must be at least 6 characters'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your new password'
    else if (form.confirmPassword !== form.newPassword) nextErrors.confirmPassword = 'Passwords do not match'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      onSave('Your password changed successfully')
    }
  }

  return (
    <section className='settings-content-card settings-security-card'>
      <h3>Security Settings</h3>
      <p>Manage your password and security preferences</p>

      <div className='settings-security-form'>
        <label className='settings-field'>
          <span>Current Password</span>
          <div className='settings-password-field'>
            <input type='password' value={form.currentPassword} onChange={(event) => updateField('currentPassword', event.target.value)} />
            <Eye size={18} />
          </div>
          <FieldError message={errors.currentPassword} />
        </label>

        <label className='settings-field'>
          <span>New Password</span>
          <div className='settings-password-field'>
            <input type='password' value={form.newPassword} onChange={(event) => updateField('newPassword', event.target.value)} />
            <Eye size={18} />
          </div>
          <FieldError message={errors.newPassword} />
        </label>

        <label className='settings-field'>
          <span>Confirm New Password</span>
          <input type='password' value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} />
          <FieldError message={errors.confirmPassword} />
        </label>
      </div>

      <button className='settings-save-btn settings-change-password-btn' type='button' onClick={handleSave}>
        <Shield size={16} />
        <span>Change Password</span>
      </button>
    </section>
  )
}

const SystemSettings = ({ onSave }) => {
  const [form, setForm] = useState({
    currency: '',
    timezone: '',
    dateFormat: '',
    language: '',
  })
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSave = () => {
    const nextErrors = {}

    if (!form.currency.trim()) nextErrors.currency = 'Currency is required'
    if (!form.timezone.trim()) nextErrors.timezone = 'Timezone is required'
    if (!form.dateFormat.trim()) nextErrors.dateFormat = 'Date format is required'
    if (!form.language.trim()) nextErrors.language = 'Language is required'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave()
  }

  return (
    <section className='settings-content-card settings-system-card'>
      <h3>System Preferences</h3>
      <p>Configure system-wide settings</p>

      <div className='settings-form settings-system-form'>
        <label className='settings-field'>
          <span>Currency</span>
          <input type='text' value={form.currency} onChange={(event) => updateField('currency', event.target.value)} />
          <FieldError message={errors.currency} />
        </label>

        <label className='settings-field'>
          <span>Timezone</span>
          <input type='text' value={form.timezone} onChange={(event) => updateField('timezone', event.target.value)} />
          <FieldError message={errors.timezone} />
        </label>

        <label className='settings-field'>
          <span>Date Format</span>
          <input type='text' value={form.dateFormat} onChange={(event) => updateField('dateFormat', event.target.value)} />
          <FieldError message={errors.dateFormat} />
        </label>

        <label className='settings-field'>
          <span>Language</span>
          <input type='text' value={form.language} onChange={(event) => updateField('language', event.target.value)} />
          <FieldError message={errors.language} />
        </label>
      </div>

      <button className='settings-save-btn' type='button' onClick={handleSave}>
        <Save size={16} />
        <span>Save Changes</span>
      </button>
    </section>
  )
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('notifications')
  const [showSavePopup, setShowSavePopup] = useState(false)
  const [savePopupMessage, setSavePopupMessage] = useState('Saved changes has been made')

  const handleSaveSuccess = (message = 'Saved changes has been made') => {
    setSavePopupMessage(message)
    setShowSavePopup(true)
  }

  useEffect(() => {
    if (!showSavePopup) return undefined

    const timer = setTimeout(() => {
      setShowSavePopup(false)
    }, 2200)

    return () => clearTimeout(timer)
  }, [showSavePopup])

  return (
    <div className='settings-page'>
      <div className='settings-title'>
        <h2>Settings</h2>
        <p>Manage your account and application preferences</p>
      </div>

      <div className={activeSection === 'notifications' ? 'settings-layout settings-layout-notification' : 'settings-layout'}>
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

        </aside>

        {activeSection === 'profile' && <ProfileSettings onSave={handleSaveSuccess} />}
        {activeSection === 'notifications' && <NotificationSettings onSave={handleSaveSuccess} />}
        {activeSection === 'security' && <SecuritySettings onSave={handleSaveSuccess} />}
        {activeSection === 'system' && <SystemSettings onSave={handleSaveSuccess} />}
      </div>

      {showSavePopup && <SaveSuccessPopup message={savePopupMessage} />}
    </div>
  )
}

export default Settings
