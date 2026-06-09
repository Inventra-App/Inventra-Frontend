import React, { useState } from 'react'
import { ClipboardList, ShoppingCart, Truck, Package, RefreshCw, User, Calendar, ChevronDown, Filter } from 'lucide-react'
import './Css/ActivityLog.css'

const statCards = [
  { label: 'Total Activities', value: 1, icon: <ClipboardList size={20} />, color: 'blue' },
  { label: 'Sales', value: 0, icon: <ShoppingCart size={20} />, color: 'green' },
  { label: 'Goods Received', value: 1, icon: <Truck size={20} />, color: 'purple' },
  { label: 'Products Created', value: 0, icon: <Package size={20} />, color: 'pink' },
  { label: 'Inventory Updates', value: 0, icon: <Package size={20} />, color: 'orange' },
]

const activities = [
  { type: 'sale', label: 'Completed sale', tag: 'Sale', desc: 'Sold 5 units of Coca Cola 500ml for ₦750', user: 'Jane Benneth Oyekwere', date: '2026-05-14 14:30:25', amount: '+₦750' },
  { type: 'inventory', label: 'Added new product', tag: 'Inventory', desc: 'Added "Corn Flakes" with 60 units', user: 'John Emmanuel', date: '2026-05-14 14:15:10', amount: null },
  { type: 'sale', label: 'Completed sale', tag: 'Sale', desc: 'Sold 2 units of Peak Milk 400g for ₦900', user: 'Vincent Miracle', date: '2026-05-14 14:07:45', amount: '+₦900' },
  { type: 'receiving', label: 'Recorded delivery', tag: 'Receiving', desc: 'Received 50 units of Fresh Milk 1L from FrieslandCampina', user: 'Anthony Onyema', date: '2026-05-14 13:45:30', amount: null },
  { type: 'inventory', label: 'Updated stock', tag: 'Inventory', desc: 'Adjusted Rice 50kg quantity from 45 to 50 units', user: 'Nnaemeka Noble', date: '2026-05-14 13:20:15', amount: null },
  { type: 'inventory', label: 'Product update', tag: 'Inventory', desc: 'Updated expiry date for Butter 250g batch', user: 'Anthony Onyema', date: '2026-05-14 12:15:45', amount: null },
  { type: 'sale', label: 'Completed sale', tag: 'Sale', desc: 'Sold 3 units of Golden Penny Bread for ₦1,050', user: 'Jane Benneth Oyekwere', date: '2026-05-14 13:10:00', amount: '+₦1,050' },
  { type: 'receiving', label: 'Recorded delivery', tag: 'Receiving', desc: 'Received 100 units of Coca Cola 500ml from Nigerian Bottling Company', user: 'John Emmanuel', date: '2026-05-14 12:55:22', amount: null },
  { type: 'sale', label: 'Completed sale', tag: 'Sale', desc: 'Sold 10 units of Indomie Noodles for ₦800', user: 'Jane Benneth Oyekwere', date: '2026-05-14 11:58:33', amount: '+₦800' },
]

const filterOptions = [
  { label: 'All Activities', value: 'all' },
  { label: 'Sales', value: 'sale' },
  { label: 'Goods Received', value: 'receiving' },
  { label: 'Products created', value: 'inventory' },
  { label: 'Stock Update', value: 'stock' },
]

const getIcon = (type) => {
  if (type === 'sale') return <ShoppingCart size={18} />
  if (type === 'receiving') return <Truck size={18} />
  return <Package size={18} />
}

const getIconClass = (type) => {
  if (type === 'sale') return 'activity-icon-green'
  if (type === 'receiving') return 'activity-icon-purple'
  return 'activity-icon-blue'
}

const getTagClass = (tag) => {
  if (tag === 'Sale') return 'activity-tag-green'
  if (tag === 'Receiving') return 'activity-tag-purple'
  return 'activity-tag-blue'
}

const ActivityLog = () => {
  const [filter, setFilter] = useState('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter)

  const getFilterLabel = () => {
    const option = filterOptions.find((o) => o.value === filter)
    return `${option?.label}(${filter === 'all' ? activities.length : filtered.length})`
  }

  return (
    <div className="activity-page">

      <div className="activity-top">
        <h2 className="activity-title">Activity</h2>
        <p className="activity-sub">Track all actions and maintain accountability</p>
      </div>

      <div className="activity-stats">
        {statCards.map((card, index) => (
          <div key={index} className="activity-stat-card">
            <div className={`activity-stat-icon activity-stat-${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="activity-stat-label">{card.label}</p>
              <h3 className="activity-stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-filter-bar">
        <div className="activity-filter-left">
          <span className="activity-filter-icon"><Filter size={16} /></span>
          <span className="activity-filter-label">Filter by Action:</span>
        </div>
        <div className="activity-dropdown-wrapper">
          <button className="activity-dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {getFilterLabel()} <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="activity-dropdown-menu">
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className={`activity-dropdown-item ${filter === option.value ? 'activity-dropdown-active' : ''}`}
                  onClick={() => { setFilter(option.value); setDropdownOpen(false) }}
                >
                  {option.label}({option.value === 'all' ? activities.length : activities.filter((a) => a.type === option.value).length})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="activity-timeline-card">
        <h3 className="activity-timeline-title">Activity Timeline</h3>
        <div className="activity-list">
          {filtered.map((item, index) => (
            <div key={index} className="activity-item">
              <div className={`activity-icon-wrap ${getIconClass(item.type)}`}>
                {getIcon(item.type)}
              </div>
              <div className="activity-item-body">
                <div className="activity-item-top">
                  <span className="activity-item-label">{item.label}</span>
                  <span className={`activity-tag ${getTagClass(item.tag)}`}>{item.tag}</span>
                </div>
                <p className="activity-item-desc">{item.desc}</p>
                <div className="activity-item-meta">
                  <div className="activity-meta-user">
                    <User size={13} />
                    <span>{item.user}</span>
                  </div>
                  <div className="activity-meta-date">
                    <Calendar size={13} />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
              {item.amount && (
                <span className="activity-amount">{item.amount}</span>
              )}
            </div>
          ))}
        </div>

        <div className="activity-footer">
          <p>Showing 1 to {filtered.length} of 120 actions</p>
          <div className="activity-pagination">
            <button>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>...</button>
            <button>›</button>
            <span>4 per page ▾</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ActivityLog