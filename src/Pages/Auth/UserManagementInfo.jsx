import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Css/UserManagementInfo.css'

const actions = [
  {
    title: 'Onboard Staff',
    text: 'Create accounts for cashiers, inventory staff, and managers in just a few clicks.',
  },
  {
    title: 'Assign Roles',
    text: 'Assign predefined roles based on job responsibilities, ensuring each staff member has the right level of access.',
  },
  {
    title: 'Manage Permissions',
    text: 'Control what users can view, create, update, or manage within the system.',
  },
  {
    title: 'Update Roles',
    text: 'Easily change staff roles as responsibilities evolve within your business.',
  },
  {
    title: 'Suspend or Reactivate Accounts',
    text: 'Temporarily restrict access for inactive staff or reactivate accounts when needed.',
  },
  {
    title: 'Track User Activities',
    text: 'Monitor actions performed by staff members through the Activity Log for better accountability and transparency.',
  },
]

const UserManagementInfo = () => {
  const navigate = useNavigate()

  return (
    <main className="user-info-page">
      <button className="user-info-back" type="button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      <div className="user-info-layout">
        <section className="user-info-copy">
          <div className="user-info-section">
            <h1>User Management</h1>
            <p className="user-info-lead">Manage your team with confidence and control.</p>
            <p>
              Inventra's User Management feature helps supermarket owners and managers efficiently
              manage staff accounts, assign responsibilities, and maintain accountability across
              daily operations.
            </p>
          </div>

          <div className="user-info-section user-info-why">
            <h2>Why it matter ?</h2>
            <p>
              User Management helps reduce operational errors, improve security, and ensure that
              every team member only has access to the tools they need to perform their duties
              effectively.
            </p>
            <p>
              With Inventra, managing your workforce becomes simple, secure, and organized.
            </p>
          </div>
        </section>

        <section className="user-info-card" aria-labelledby="user-info-actions-title">
          <h2 id="user-info-actions-title">What You Can Do</h2>
          <ol className="user-info-actions">
            {actions.map((action) => (
              <li key={action.title}>
                <strong>{action.title}</strong>
                <p>{action.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}

export default UserManagementInfo
