import React from 'react'
import { Package, Activity, ShoppingCart, AlertTriangle, TrendingDown, Calendar, Truck } from 'lucide-react'
import './Css/Dashboard.css'

const statCards = [
  { label: 'Total Products', value: '8', icon: <Package size={22} />, color: 'blue' },
  { label: 'Total Stock Units', value: '477', icon: <Activity size={22} />, color: 'green' },
  { label: 'Sales Today', value: '4', icon: <ShoppingCart size={22} />, color: 'purple' },
  { label: 'Critical Alerts', value: '2', sub: 'Products expiring soon', icon: <AlertTriangle size={22} />, color: 'red' },
]

const expiryAlerts = [
  { name: 'Yogurt', batch: 'BTH-2026-004', qty: 30, expires: 'May 18, 2026', daysLeft: 0 },
  { name: 'White Bread', batch: 'BTH-2026-002', qty: 20, expires: 'May 20, 2026', daysLeft: 2 },
  { name: 'SARDINES', batch: 'BTH-202605-9SW5', qty: 97, expires: 'May 23, 2026', daysLeft: 5 },
]

const lowStockAlerts = [
  { name: 'Fresh Eggs (Dozen)', category: 'Poultry', units: 8 },
  { name: 'Orange Juice', category: 'Beverages', units: 9 },
]

const recentActivities = [
  { type: 'sale', text: 'Sold 10 units of "packet of sugar" for ₦10000', user: 'Admin User', time: 'May 18, 2026 10:03' },
  { type: 'receive', text: 'Received 100 units of "packet of sugar" (Batch: BTH-202605-PYB4)', user: 'Admin User', time: 'May 18, 2026 10:02' },
  { type: 'create', text: 'Product "packet of sugar" created', user: 'Admin User', time: 'May 18, 2026 10:01' },
  { type: 'sale', text: 'Sold 3 units of "SARDINES" for ₦3600', user: 'Admin User', time: 'May 18, 2026 07:13' },
  { type: 'sale', text: 'Sold 6 units of "Orange Juice" for ₦2100', user: 'Admin User', time: 'May 18, 2026 07:13' },
  { type: 'sale', text: 'Sold 2 units of "bag of rice" for ₦64000', user: 'Admin User', time: 'May 18, 2026 07:13' },
  { type: 'receive', text: 'Received 30 units of "bag of rice" (Batch: BTH-202605-NSIO)', user: 'Admin User', time: 'May 18, 2026 07:10' },
  { type: 'receive', text: 'Received 100 units of "SARDINES" (Batch: BTH-202605-9SW5)', user: 'Admin User', time: 'May 17, 2026 22:43' },
]

const getActivityIcon = (type) => {
  if (type === 'sale') return <ShoppingCart size={18} />
  if (type === 'receive') return <Truck size={18} />
  return <Package size={18} />
}

const getExpiryColor = (days) => {
  if (days === 0) return 'expiry-red'
  if (days <= 2) return 'expiry-orange'
  return 'expiry-yellow'
}

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Welcome back, Admin User!</h2>
        <p>Here's what's happening in your supermarket today. <span className="dashboard-role">(Admin)</span></p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-left">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{card.value}</h3>
              {card.sub && <p className="stat-sub">{card.sub}</p>}
            </div>
            <div className={`stat-icon stat-icon-${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-alerts">
        <div className="alert-card">
          <div className="alert-card-header">
            <div className="alert-card-title">
              <AlertTriangle size={18} className="alert-icon-orange" />
              <h4>Expiry Alerts</h4>
            </div>
            <span className="alert-badge alert-badge-orange">{expiryAlerts.length}</span>
          </div>
          <div className="alert-list">
            {expiryAlerts.map((item, index) => (
              <div key={index} className={`expiry-item ${getExpiryColor(item.daysLeft)}`}>
                <div className="expiry-item-left">
                  <p className="expiry-name">{item.name}</p>
                  <p className="expiry-meta">Batch: {item.batch} • Qty: {item.qty} • Expires: {item.expires}</p>
                </div>
                <span className="expiry-tag">{item.daysLeft}d left</span>
              </div>
            ))}
          </div>
        </div>

        <div className="alert-card">
          <div className="alert-card-header">
            <div className="alert-card-title">
              <TrendingDown size={18} className="alert-icon-red" />
              <h4>Low Stock Alerts</h4>
            </div>
            <span className="alert-badge alert-badge-red">{lowStockAlerts.length}</span>
          </div>
          <div className="alert-list">
            {lowStockAlerts.map((item, index) => (
              <div key={index} className="lowstock-item">
                <div>
                  <p className="expiry-name">{item.name}</p>
                  <p className="expiry-meta">Category: {item.category}</p>
                </div>
                <div className="lowstock-units">
                  <span className="lowstock-count">{item.units}</span>
                  <span className="lowstock-label">units left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="activity-card">
        <div className="alert-card-header">
          <div className="alert-card-title">
            <Calendar size={18} className="alert-icon-blue" />
            <h4>Recent Activities</h4>
          </div>
        </div>
        <div className="activity-list">
          {recentActivities.map((item, index) => (
            <div key={index} className="activity-item">
              <div className={`activity-icon activity-icon-${item.type}`}>
                {getActivityIcon(item.type)}
              </div>
              <div className="activity-text">
                <p className="activity-desc">{item.text}</p>
                <p className="activity-meta">{item.user} • {item.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="activity-footer">
          <p>Showing 1 to 8 of 50 actions</p>
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

export default Dashboard