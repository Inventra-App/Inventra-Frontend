import React from 'react'
import { Clock, UserCircle, CalendarCheck, Lock, Shield } from 'lucide-react'
import BadgeItem from './BadgeItem'
import '../Css/Track.css'

const badges = [
  { icon: <Clock size={18} />, label: 'Role- based Access' },
  { icon: <Clock size={18} />, label: 'Real-time Activity Tracking' },
  { icon: <Clock size={18} />, label: 'Action History & Audit Logs' },
  { icon: <Clock size={18} />, label: 'Improve Accountability' },
]

const details = [
  {
    icon: <UserCircle size={26} />,
    title: 'Individual Staff Accounts',
    desc: 'Each Staff member operates with a unique login and role- based access.',
  },
  {
    icon: <CalendarCheck size={26} />,
    title: 'Activity Tracking',
    desc: 'Monitor inventory changes, sales actions, stock updates and more in real-time',
  },
  {
    icon: <Lock size={26} />,
    title: 'Secure Permissions',
    desc: 'Control what staff members can access based on their roles and responsibilities.',
  },
  {
    icon: <Shield size={26} />,
    title: 'Operational Transparency',
    desc: 'Access complete action history and audit logs to ensure accountability in your business',
  },
]

const Track = () => {
  return (
    <div className="track-section">

      <div className="track-left">
        <h2 className="track-title">Track Every Staff Action</h2>
        <p className="track-subtitle">With Full Transparency</p>
        <p className="track-desc">
          Inventra helps supermarkets improve accountability by tracking staff
          activities across inventory updates, sales transactions, stock handling,
          and operational actions. Every action is linked to a specific staff
          account, helping businesses reduce errors, improve transparency,
          and manage operations more efficiently.
        </p>

        <div className="track-badges">
          {badges.map((badge, index) => (
            <BadgeItem key={index} icon={badge.icon} label={badge.label} />
          ))}
        </div>
        <button className="track-btn">
          Learn more about user management →
        </button>
      </div>

      <div className="track-right">
        {details.map((item, index) => (
          <div key={index} className="track-detail-item">
            <div className="track-detail-icon">{item.icon}</div>
            <div className="track-detail-text">
              <h4 className="track-detail-title">{item.title}</h4>
              <p className="track-detail-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Track