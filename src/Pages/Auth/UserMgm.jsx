import React, { useState } from 'react'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  Lock,
  Settings,
  Shield,
  User,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import './Css/UserMgm.css'
import Icon1 from '../../assets/Icon (10).png'
import Icon2 from '../../assets/Icon (11).png'
import Vector from '../../assets/Vector (2).png'
import Icon3 from '../../assets/Icon (0).png'
import Icon4 from '../../assets/Icon (6).png'
import Icon5 from '../../assets/Icon (7).png'
import manage from '../../assets/manage-roles-icon.png'
import green from '../../assets/Icon green.png'
import gray from '../../assets/Icon gray.png'
const UserMgm = () => {
  const [users, setUsers] = useState([
    { id: 'user-001', name: 'Admin User', username: 'admin001', role: 'Admin', status: 'Active', isCurrent: true, joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
    { id: 'user-002', name: 'Admin User', username: 'admin', role: 'Admin', status: 'Active', joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
    { id: 'user-003', name: 'Store Manager', username: 'manager', role: 'Manager', status: 'Active', joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
    { id: 'user-004', name: 'Jane Cashier', username: 'cashier1', role: 'Cashier', status: 'Active', joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
    { id: 'user-005', name: 'John Staff', username: 'staff1', role: 'Staff', status: 'Active', joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
    { id: 'user-1779480351703-nnrusnyoc', name: 'anthony onyema', username: 'onyema3004', role: 'Staff', status: 'Active', joined: 'May 1st 2026', lastLogin: 'May 1st 2026' },
  ])

  const [page, setPage] = useState('users')
  const [modal, setModal] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [toast, setToast] = useState('')

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [newRole, setNewRole] = useState('')
  const [copied, setCopied] = useState(false)

  const permissions = [
    'Dashboard',
    'Inventory',
    'Incoming Stock',
    'Low Stock Management',
    'Sales (POS)',
    'Expiry Management',
    'Reports',
    'User Management',
    'Settings',
    'Activity Logs',
  ]

  const roles = ['Admin', 'Manager', 'Cashier', 'Staff']

  const roleText = {
    Admin: 'Full system access. Can manage users, view all reports, and configure system settings.',
    Manager: 'Can manage inventory, view reports, receive goods, and monitor expiry alerts.',
    Cashier: 'Can process sales, view inventory, and access sales history.',
    Staff: 'Can add products, receive goods, and update inventory levels.',
  }

  const totalUsers = users.length
  const adminCount = users.filter((user) => user.role === 'Admin').length
  const managerCount = users.filter((user) => user.role === 'Manager').length
  const staffCount = users.filter((user) => user.role === 'Staff').length

  const showToast = (message) => {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 2500)
  }

  const getRoleClass = (userRole) => {
    return userRole.toLowerCase()
  }

  const closeModal = () => {
    setModal('')
    setNewRole('')
    setCopied(false)
  }

  const openDetails = (user) => {
    setSelectedUser(user)
    setModal('details')
  }

  const createUser = (event) => {
    event.preventDefault()

    const cleanName = fullName.trim()
    const cleanUsername = username.trim()
    const cleanPassword = password.trim()

    if (cleanName === '') {
      alert('Full name is required')
      return
    }

    if (cleanUsername === '') {
      alert('Username is required')
      return
    } else if (cleanUsername.includes('@')) {
      alert('Username should not be an email address')
      return
    } else if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      alert('Use only letters, numbers, and underscore')
      return
    } else {
      const usernameExists = users.find((user) => user.username.toLowerCase() === cleanUsername.toLowerCase())
      if (usernameExists) {
        alert('Username already exists')
        return
      }
    }

    if (cleanPassword === '') {
      alert('Password is required')
      return
    } else if (cleanPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (role === '') {
      alert('Role is required')
      return
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      role,
      status: 'Active',
      joined: 'May 1st 2026',
      lastLogin: 'May 1st 2026',
    }

    setUsers([...users, newUser])
    setFullName('')
    setUsername('')
    setPassword('')
    setRole('')
    closeModal()
    showToast('New User has been created')
  }

 const toggleUserStatus = () => {
  const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active'
  const updatedUsers = users.map((user) => {
    if (user.id === selectedUser.id) {
      return { ...user, status: newStatus }
    }

    return user
  })

  setUsers(updatedUsers)
  setSelectedUser({ ...selectedUser, status: newStatus })
  closeModal()
  showToast(newStatus === 'Active' ? 'User activated successfully' : 'User suspended successfully')
}

  const saveRoleChange = (event) => {
    event.preventDefault()

    if (newRole === '') return

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, role: newRole }
      }

      return user
    })

    setUsers(updatedUsers)
    setSelectedUser({ ...selectedUser, role: newRole })
    closeModal()
    showToast('Role Updated Successfully')
  }

  const copyPassword = () => {
    const passwordInput = document.getElementById('temporary-password')
    passwordInput.select()
    navigator.clipboard.writeText(passwordInput.value)
    setCopied(true)
  }

  if (page === 'roles') {
    return (
      <div className="user-page role-page">
        <div className="role-page-top">
          <div>
            <h2>Role & Permissions</h2>
            <p>Manage role-based access control</p>
          </div>
          <button className="back-users-btn" type="button" onClick={() => setPage('users')}>Back to Users</button>
        </div>

        <div className="role-select-grid">
          <button className="role-select-card active" type="button">
            <span className="role-select-icon admin"><Shield size={22} /></span>
            <strong>Admin</strong>
            <small>Full system access</small>
          </button>
          <button className="role-select-card" type="button">
            <span className="role-select-icon manager"><Users size={22} /></span>
            <strong>Inventory Staff</strong>
            <small>Inventory management</small>
          </button>
          <button className="role-select-card" type="button">
            <span className="role-select-icon cashier"><Users size={22} /></span>
            <strong>Cashier</strong>
            <small>Sales operations</small>
          </button>
        </div>

        <section className="manage-permissions-card">
          <h3>Admin Permissions</h3>

          <div className="permission-toggle-list">
            {permissions.map((permission) => (
              <label className="permission-toggle-row" key={permission}>
                <span>{permission}</span>
                <input type="checkbox" defaultChecked={!['Expiry Management', 'User Management'].includes(permission)} />
                <i aria-hidden="true"></i>
              </label>
            ))}
          </div>

          <div className="save-permissions-row">
            <button type="button" onClick={() => setPage('users')}>Save Permissions</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="user-page">
      {toast !== '' && <div className="user-toast">{toast}</div>}

      <div className="user-top">
        <div>
          <h2>User Management</h2>
          <p>Manage staff accounts and access levels</p>
        </div>

        <div className="user-top-actions">
          <button className="manage-roles-btn" type="button" onClick={() => setPage('roles')}>
            <img src={manage} alt="" className="manage-roles-icon" />
            <span>Manage Roles</span>
          </button>

          <button className="onboard-btn" type="button" onClick={() => setModal('onboard')}>
            <img src={Icon1} alt="" />
            <span>Onboard Staff</span>
          </button>
        </div>
      </div>

      <section className="logged-card">
        <div className="logged-avatar">
          <img src={Icon4} alt="" />
        </div>

        <div>
          <p>Currently Logged In</p>
          <h3>Admin User</h3>
          <span>Role: Admin &bull; Username: Admin001</span>
        </div>
      </section>

      <section className="user-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon purple">
            <img src={Icon2} alt="" />
          </div>
          <div>
            <p>Total Users</p>
            <h3>{totalUsers}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon violet">
            <img src={Vector} alt="" />
          </div>
          <div>
            <p>Admins</p>
            <h3>{adminCount}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <img src={Icon3} alt="" />
          </div>
          <div>
            <p>Managers</p>
            <h3>{managerCount}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <img src={Icon5} alt="" />
          </div>
          <div>
            <p>Staff</p>
            <h3>{staffCount}</h3>
          </div>
        </div>
      </section>

      <section className="staff-card">
        <h3>Staff Directory</h3>

        <div className="staff-table">
          <div className="table-head">
            <span>User</span>
            <span>Username</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {users.map((user) => (
            <div className="table-row" key={user.id}>
              <div className="staff-user">
                <div className="staff-avatar">{user.name.charAt(0)}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>ID: {user.id}</p>
                </div>
              </div>

              <div className="table-field username-field">
                <small className="mobile-field-label">Username</small>
                <span className="username-text">{user.username}</span>
              </div>

              <div className="table-field role-field">
                <small className="mobile-field-label">Role</small>
                <span className={`role-pill ${getRoleClass(user.role)}`}>{user.role}</span>
              </div>

             <div className="table-field status-field">
  <small className="mobile-field-label">Status</small>
  <span className="status-text">
    <span></span>{user.status}
  </span>
</div>

              {user.isCurrent ? (
                <div className="table-field action-field">
                  <small className="mobile-field-label">Actions</small>
                  <span className="you-text">You</span>
                </div>
              ) : (
                <div className="table-field action-field">
                  <small className="mobile-field-label">Actions</small>
                  <button className="details-btn" type="button" onClick={() => openDetails(user)}>View Details</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="permission-card">
        <h3>Role Permissions</h3>

        <div className="permission-grid">
          <div className="permission-box admin">
            <div className="permission-title">
              <img src={Vector} alt="" />
              <h4>Admin</h4>
            </div>
            <p>{roleText.Admin}</p>
          </div>

          <div className="permission-box manager">
            <div className="permission-title">
              <img src={Icon3} alt="" />
              <h4>Manager</h4>
            </div>
            <p>{roleText.Manager}</p>
          </div>

          <div className="permission-box cashier">
            <div className="permission-title">
              <img src={green} alt="" className="icon4" />
              <h4>Cashier</h4>
            </div>
            <p>{roleText.Cashier}</p>
          </div>

          <div className="permission-box staff">
            <div className="permission-title">
              <img src={gray} alt="" />
              <h4>Staff</h4>
            </div>
            <p>{roleText.Staff}</p>
          </div>
        </div>
      </section>

      {modal === 'onboard' && (
        <div className="user-modal-backdrop compact">
          <form className="user-modal onboard-modal" onSubmit={createUser}>
            <button className="modal-close-btn" type="button" onClick={closeModal} aria-label="Close modal">
              <X size={18} />
            </button>

            <h3>Onboard New Staff Member</h3>

            <label>
              <span>Full Name</span>
              <input type="text" placeholder="John Doe" value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </label>

            <label>
              <span>Username</span>
              <input type="text" placeholder="johndoe" value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>

            <label>
              <span>Password</span>
              <input type="password" placeholder="Minimum 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>

            <label>
              <span>Role</span>
              <div className="modal-select-wrap">
                <select value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value=""></option>
                  {roles.map((singleRole) => (
                    <option key={singleRole} value={singleRole}>{singleRole}</option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </label>

            <div className="modal-actions">
              <button className="neutral-btn" type="button" onClick={closeModal}>Cancel</button>
              <button className="primary-btn" type="submit">Create User</button>
            </div>
          </form>
        </div>
      )}

      {modal === 'details' && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal details-modal">
            <button className="modal-close-btn" type="button" onClick={closeModal} aria-label="Close modal">
              <X size={18} />
            </button>

            <h3>User Details</h3>

            <div className="details-user-banner">
              <div className="details-avatar">{selectedUser.name.charAt(0)}</div>
              <div>
                <strong>{selectedUser.name}</strong>
                <span className={`role-pill ${getRoleClass(selectedUser.role)}`}>{selectedUser.role}</span>
              </div>
            </div>

            <div className={`detail-permission ${getRoleClass(selectedUser.role)}`}>
              <small>Role Permissions</small>
              <p>{roleText[selectedUser.role]}</p>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><User size={16} /></div>
              <div>
                <span>User ID</span>
                <strong>{selectedUser.id}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><UserCog size={16} /></div>
              <div>
                <span>Username</span>
                <strong>{selectedUser.username}</strong>
              </div>
            </div>

            <div className="detail-item">
  <div className="detail-icon"><CheckCircle2 size={16} /></div>
  <div>
    <span>Account Status</span>

    <strong className="active-value">
      {selectedUser.status}
    </strong>
  </div>
</div>

            <div className="detail-item">
              <div className="detail-icon"><Calendar size={16} /></div>
              <div>
                <span>Date joined</span>
                <strong>{selectedUser.joined}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Settings size={16} /></div>
              <div>
                <span>Last Login</span>
                <strong>{selectedUser.lastLogin}</strong>
              </div>
            </div>

            <button className="full-primary-btn" type="button" onClick={() => setModal('password')}>Change Password</button>

            <div className="details-actions">
              <button className="change-role-btn" type="button" onClick={() => setModal('role')}>
                <Lock size={14} />
                Change Role
              </button>

              <button className={selectedUser.status === 'Active' ? 'suspend-btn danger-action' : 'suspend-btn activate-action'} type="button" onClick={() => setModal('suspend')}>
                <img src={Icon1} alt="" />
                {selectedUser.status === 'Active' ? 'Suspend User' : 'Activate User'}
              </button>
            </div>
          </div>
        </div>
      )}

     {modal === 'suspend' && selectedUser && (
  <div className="user-modal-backdrop">
    <div className="confirm-modal">
      <div className="confirm-icon">
        <CheckCircle2 size={22} />
      </div>
      <h3>{selectedUser.status === 'Active' ? 'Suspend User' : 'Activate User'}</h3>
      <p>{selectedUser.status === 'Active' ? 'Suspending' : 'Activating'} <strong>{selectedUser.name.split(' ')[0]}</strong> {selectedUser.status === 'Active' ? 'will revoke their access to the system.' : 'will restore their access to the system.'} </p>
      <div className="confirm-actions">
        <button className="neutral-btn"type="button" onClick={() => setModal('details')} > Cancel </button>
        <button className="primary-btns" type="button" onClick={toggleUserStatus}> {selectedUser.status === 'Active' ? 'Suspend User' : 'Activate User'} </button>
      </div>
    </div>
  </div>
)}
      {modal === 'password' && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal reset-modal">
            <h3>Reset Password</h3>

            <div className="password-success-box">
              <CheckCircle2 size={22} />
              <div>
                <strong>Password Reset Successfully</strong>
                <p>Share this temporary password with the staff member</p>
              </div>
            </div>

            <div className="temp-password-box">
              <label>Temporary Password</label>
              <div>
                <input id="temporary-password" readOnly value="wdWjmfF!5x3t" />
                <button type="button" onClick={copyPassword}>
                  <Copy size={18} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button className="neutral-btn close-reset-btn" type="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {modal === 'role' && selectedUser && (
        <div className="user-modal-backdrop">
          <form className="user-modal change-role-modal" onSubmit={saveRoleChange}>
            <h3>Change Role</h3>

            <div className="role-change-info">
              <strong>Staff Member</strong>
              <p>{selectedUser.name}</p>
              <strong>Current Role</strong>
              <p>{selectedUser.role === 'Staff' ? 'Inventory Staff' : selectedUser.role}</p>
            </div>

            <label>
              <span>New Role *</span>
              <div className="modal-select-wrap role-change-select">
                <select required value={newRole} onChange={(event) => setNewRole(event.target.value)}>
                  <option value=""></option>
                  {roles.map((singleRole) => (
                    <option key={singleRole} value={singleRole}>{singleRole}</option>
                  ))}
                </select>
              </div>
            </label>

            <div className="modal-actions">
              <button className="neutral-btn" type="button" onClick={closeModal}>Cancel</button>
              <button className="primary-btn" type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default UserMgm