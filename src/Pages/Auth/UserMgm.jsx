import React from 'react'
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
  return (
    <div className="user-page">
      <div className="user-top">
        <div>
          <h2>User Management</h2>
          <p>Manage staff accounts and access levels</p>
        </div>

        <div className="user-top-actions">
          <button className="manage-roles-btn" type="button">
           <img src={manage} alt=""  className='manage-roles-icon'/>
            <span>Manage Roles</span>
          </button>

          <button className="onboard-btn" type="button">
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
          <span>Role: Admin • Username: Admin001</span>
        </div>
      </section>

      <section className="user-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon purple">
            <img src={Icon2} alt="" />
          </div>
          <div>
            <p>Total Users</p>
            <h3>6</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon violet">
           <img src={Vector} alt="" />
          </div>
          <div>
            <p>Admins</p>
            <h3>2</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <img src={Icon3} alt="" />
          </div>
          <div>
            <p>Managers</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <img src={Icon5} alt="" />
          </div>
          <div>
            <p>Staff</p>
            <h3>3</h3>
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

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">A</div>
              <div>
                <strong>Admin User</strong>
                <p>ID: user-001</p>
              </div>
            </div>
            <span className="username-text">admin001</span>
            <span className="role-pill admin">Admin</span>
            <span className="status-text"><span></span>Active</span>
            <span className="you-text">You</span>
          </div>

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">A</div>
              <div>
                <strong>Admin User</strong>
                <p>ID: user-002</p>
              </div>
            </div>
            <span className="username-text">admin</span>
            <span className="role-pill admin">Admin</span>
            <span className="status-text"><span></span>Active</span>
            <button className="details-btn" type="button">View Details</button>
          </div>

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">S</div>
              <div>
                <strong>Store Manager</strong>
                <p>ID: user-003</p>
              </div>
            </div>
            <span className="username-text">manager</span>
            <span className="role-pill manager">Manager</span>
            <span className="status-text"><span></span>Active</span>
            <button className="details-btn" type="button">View Details</button>
          </div>

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">J</div>
              <div>
                <strong>Jane Cashier</strong>
                <p>ID: user-004</p>
              </div>
            </div>
            <span className="username-text">cashier1</span>
            <span className="role-pill cashier">Cashier</span>
            <span className="status-text"><span></span>Active</span>
            <button className="details-btn" type="button">View Details</button>
          </div>

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">J</div>
              <div>
                <strong>John Staff</strong>
                <p>ID: user-005</p>
              </div>
            </div>
            <span className="username-text">staff1</span>
            <span className="role-pill staff">Staff</span>
            <span className="status-text"><span></span>Active</span>
            <button className="details-btn" type="button">View Details</button>
          </div>

          <div className="table-row">
            <div className="staff-user">
              <div className="staff-avatar">a</div>
              <div>
                <strong>anthony onyema</strong>
                <p>ID: user-1779480351703-nnrusnyoc</p>
              </div>
            </div>
            <span className="username-text">onyema3004</span>
            <span className="role-pill staff">Staff</span>
            <span className="status-text"><span></span>Active</span>
            <button className="details-btn" type="button">View Details</button>
          </div>
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
            <p>Full system access. Can manage users, view all reports, and configure system settings.</p>
          </div>

          <div className="permission-box manager">
            <div className="permission-title">
       <img src={Icon3} alt="" />
              <h4>Manager</h4>
            </div>
            <p>Can manage inventory, view reports, receive goods, and monitor expiry alerts.</p>
          </div>

          <div className="permission-box cashier">
            <div className="permission-title">
           <img src={green} alt="" className='icon4'/>
              <h4>Cashier</h4>
            </div>
            <p>Can process sales, view inventory, and access sales history.</p>
          </div>

          <div className="permission-box staff">
            <div className="permission-title">
              <img src={gray} alt="" />
              <h4>Staff</h4>
            </div>
            <p>Can add products, receive goods, and update inventory levels.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserMgm
