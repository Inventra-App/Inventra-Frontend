import React from 'react'
import { AlertTriangle, Package, Calendar, Eye } from 'lucide-react'
import './Css/ExpiryMgm.css'

const statCards = [
  { label: 'Total Alerts', value: 5, color: 'orange', bg: 'orange-bg' },
  { label: 'Critical', value: 2, color: 'red', bg: 'red-bg' },
  { label: 'Warning', value: 2, color: 'orange', bg: 'orange-bg' },
  { label: 'Info', value: 1, color: 'yellow', bg: 'yellow-bg' },
]

const criticalItems = [
  { name: 'Yogurt', batch: 'BATCH: BTH-2026-004', quantity: 30, expires: 'May 18, 2026', status: 'EXPIRED', daysLeft: '0d left' },
  { name: 'White Bread', batch: 'BATCH: BTH-2026-002', quantity: 20, expires: 'May 20, 2026', status: 'EXPIRED', daysLeft: '0d left' },
  { name: 'Fresh Milk', batch: 'BATCH: BTH-2026-001', quantity: 45, expires: 'May 25, 2026', status: 'EXPIRED', daysLeft: '0d left' },
]

const warningItems = [
  { name: 'SARDINES', batch: 'BATCH: BTH-202605-9SW5', quantity: 97, expires: 'May 23, 2026', daysLeft: '5 days left' },
  { name: 'Fresh Milk', batch: 'BATCH-2405012', quantity: 45, expires: 'May 15, 2026', daysLeft: '5 days left' },
]

const infoItems = [
  { name: 'Orange Juice', batch: 'BATCH: BTH-2026-005', quantity: 15, expires: 'Jun 10, 2026', daysLeft: '8 days left' },
]

const ExpiryMgm = () => {
  return (
    <div className="expiry-page">

      <div className="expiry-top">
        <h2 className="expiry-title">Expiry Updates</h2>
        <p className="expiry-sub expiry-sub-desktop">Monitor products approaching expiry dates</p>
        <p className="expiry-sub expiry-sub-mobile">
          Here's what's happening in your supermarket today. <span className="expiry-admin">(Admin)</span>
        </p>
      </div>

      <div className="expiry-stats">
        {statCards.map((card, index) => (
          <div key={index} className="expiry-stat-card">
            <div className={`expiry-stat-icon expiry-icon-${card.color}`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className={`expiry-stat-label expiry-label-${card.color}`}>{card.label}</p>
              <h3 className={`expiry-stat-value expiry-value-${card.color}`}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <button className="expiry-manage-btn">+ Manage Expiry</button>

      <div className="expiry-section">
        <div className="expiry-section-header">
          <h3>Critical (Expired)</h3>
          <span className="expiry-count expiry-count-red">{criticalItems.length} items</span>
        </div>
        <div className="expiry-list">
          {criticalItems.map((item, index) => (
            <div key={index} className="expiry-item expiry-item-red">
              <div className="expiry-item-left">
                <div className="expiry-item-icon expiry-item-icon-red">
                  <Package size={18} />
                </div>
                <div className="expiry-item-body">
                  <div className="expiry-item-top-mobile">
                    <p className="expiry-item-name">{item.name}</p>
                    <span className="expiry-days-red">{item.daysLeft}</span>
                  </div>
                  <p className="expiry-item-name expiry-item-name-desktop">{item.name}</p>
                  <span className="expiry-batch-tag">{item.batch}</span>
                  <div className="expiry-item-meta">
                    <span>Quantity: {item.quantity}</span>
                    <div className="expiry-date">
                      <Calendar size={13} />
                      <span>{item.expires}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="expiry-item-right">
                <span className="expiry-status-red">{item.status}</span>
                <button className="expiry-view-btn">
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="expiry-section">
        <div className="expiry-section-header">
          <h3>Warning (4-7 days)</h3>
          <span className="expiry-count expiry-count-orange">{warningItems.length} items</span>
        </div>
        <div className="expiry-list">
          {warningItems.map((item, index) => (
            <div key={index} className="expiry-item expiry-item-orange">
              <div className="expiry-item-left">
                <div className="expiry-item-icon expiry-item-icon-orange">
                  <Package size={18} />
                </div>
                <div className="expiry-item-body">
                  <div className="expiry-item-top-mobile">
                    <p className="expiry-item-name">{item.name}</p>
                    <span className="expiry-days-orange">{item.daysLeft}</span>
                  </div>
                  <p className="expiry-item-name expiry-item-name-desktop">{item.name}</p>
                  <span className="expiry-batch-tag">{item.batch}</span>
                  <div className="expiry-item-meta">
                    <span>Quantity: {item.quantity}</span>
                    <div className="expiry-date">
                      <Calendar size={13} />
                      <span>{item.expires}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="expiry-item-right">
                <span className="expiry-days-orange">{item.daysLeft}</span>
                <button className="expiry-view-btn">
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="expiry-section">
        <div className="expiry-section-header">
          <h3>Info (8-14 days)</h3>
          <span className="expiry-count expiry-count-yellow">{infoItems.length} items</span>
        </div>
        <div className="expiry-list">
          {infoItems.map((item, index) => (
            <div key={index} className="expiry-item expiry-item-yellow">
              <div className="expiry-item-left">
                <div className="expiry-item-icon expiry-item-icon-yellow">
                  <Package size={18} />
                </div>
                <div className="expiry-item-body">
                  <div className="expiry-item-top-mobile">
                    <p className="expiry-item-name">{item.name}</p>
                    <span className="expiry-days-yellow">{item.daysLeft}</span>
                  </div>
                  <p className="expiry-item-name expiry-item-name-desktop">{item.name}</p>
                  <span className="expiry-batch-tag">{item.batch}</span>
                  <div className="expiry-item-meta">
                    <span>Quantity: {item.quantity}</span>
                    <div className="expiry-date">
                      <Calendar size={13} />
                      <span>{item.expires}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="expiry-item-right">
                <span className="expiry-days-yellow">{item.daysLeft}</span>
                <button className="expiry-view-btn">
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ExpiryMgm