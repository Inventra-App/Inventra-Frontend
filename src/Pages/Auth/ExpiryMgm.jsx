import React, { useState } from 'react'
import { AlertTriangle, Package, Calendar, Eye, Box, Truck, Trash2, X } from 'lucide-react'
import './Css/ExpiryMgm.css'

const statCards = [
  { label: 'Total Alerts', value: 5, color: 'orange', bg: 'orange-bg' },
  { label: 'Critical', value: 2, color: 'red', bg: 'red-bg' },
  { label: 'Warning', value: 2, color: 'orange', bg: 'orange-bg' },
  { label: 'Info', value: 1, color: 'yellow', bg: 'yellow-bg' },
]

const criticalItems = [
  { name: 'Yogurt', productId: 'prod-004', category: 'Dairy', price: 180, batch: 'BTH-2026-004', quantity: 30, expires: 'May 18, 2026', status: 'EXPIRED', daysLeft: '0d left', expiredAgo: 'Expired 15 days ago' },
  { name: 'White Bread', productId: 'prod-002', category: 'Bakery', price: 150, batch: 'BTH-2026-002', quantity: 20, expires: 'May 20, 2026', status: 'EXPIRED', daysLeft: '0d left', expiredAgo: 'Expired 13 days ago' },
  { name: 'Fresh Milk', productId: 'prod-001', category: 'Dairy', price: 250, batch: 'BTH-2026-001', quantity: 45, expires: 'May 25, 2026', status: 'EXPIRED', daysLeft: '0d left', expiredAgo: 'Expired 8 days ago' },
]

const warningItems = [
  { name: 'SARDINES', productId: 'prod-009', category: 'Canned', price: 600, batch: 'BTH-202605-9SW5', quantity: 97, expires: 'May 23, 2026', daysLeft: '5 days left' },
  { name: 'Fresh Milk', productId: 'prod-012', category: 'Dairy', price: 250, batch: 'BATCH-2405012', quantity: 45, expires: 'May 15, 2026', daysLeft: '5 days left' },
]

const infoItems = [
  { name: 'Orange Juice', productId: 'prod-005', category: 'Drinks', price: 350, batch: 'BTH-2026-005', quantity: 15, expires: 'Jun 10, 2026', daysLeft: '8 days left' },
]

const ExpiryMgm = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [removingProduct, setRemovingProduct] = useState(null)
  const [showRemovePopup, setShowRemovePopup] = useState(false)
  const [showRemovalSuccess, setShowRemovalSuccess] = useState(false)

  const formatNaira = (amount) => `₦${amount.toFixed(2)}`
  const batchValue = selectedProduct ? selectedProduct.quantity * selectedProduct.price : 0

  const confirmRemoval = () => {
    setShowRemovePopup(false)
    setRemovingProduct(null)
    setShowRemovalSuccess(true)

    setTimeout(() => {
      setShowRemovalSuccess(false)
    }, 2500)
  }

  const openRemovePopup = () => {
    setRemovingProduct(selectedProduct)
    setSelectedProduct(null)
    setShowRemovePopup(true)
  }

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
                  <span className="expiry-batch-tag">BATCH: {item.batch}</span>
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
                <button className="expiry-view-btn" type="button" onClick={() => setSelectedProduct(item)}>
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
                  <span className="expiry-batch-tag">BATCH: {item.batch}</span>
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
                <button className="expiry-view-btn" type="button" onClick={() => setSelectedProduct(item)}>
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
                  <span className="expiry-batch-tag">BATCH: {item.batch}</span>
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
                <button className="expiry-view-btn" type="button" onClick={() => setSelectedProduct(item)}>
                  <Eye size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="expiry-detail-backdrop" onClick={() => setSelectedProduct(null)}>
          <aside className="expiry-detail-panel" onClick={(event) => event.stopPropagation()}>
            <div className="expiry-detail-header">
              <h3>Product Details</h3>
              <button type="button" onClick={() => setSelectedProduct(null)} aria-label="Close details">
                <X size={16} />
              </button>
            </div>

            <div className="expiry-expired-alert">
              <AlertTriangle size={20} />
              <div>
                <strong>Product Expired</strong>
                <span>{selectedProduct.expiredAgo || 'Product is nearing expiry'}</span>
              </div>
            </div>

            <div className="expiry-detail-product">
              <div className="expiry-detail-box-icon">
                <Box size={34} />
              </div>
              <div>
                <h2>{selectedProduct.name}</h2>
                <p>Product ID: {selectedProduct.productId}</p>
                <div className="expiry-detail-product-row">
                  <span>{selectedProduct.category}</span>
                  <strong>{formatNaira(selectedProduct.price)}</strong>
                </div>
              </div>
            </div>

            <section className="expiry-detail-card">
              <h4><Truck size={15} /> Batch Information</h4>
              <div className="expiry-detail-grid">
                <div>
                  <span>Batch Number</span>
                  <strong>{selectedProduct.batch}</strong>
                </div>
                <div>
                  <span>Quantity in Batch</span>
                  <strong>{selectedProduct.quantity} units</strong>
                </div>
                <div>
                  <span>Expiry Date</span>
                  <strong>{selectedProduct.expires}</strong>
                </div>
                <div>
                  <span>Days Remaining</span>
                  <strong className="expiry-red-text">{selectedProduct.status || selectedProduct.daysLeft}</strong>
                </div>
              </div>
            </section>

            <div className="expiry-detail-stats-row">
              <div className="expiry-mini-card expiry-mini-blue">
                <span>Total Stock</span>
                <strong>{selectedProduct.quantity}</strong>
              </div>
              <div className="expiry-mini-card expiry-mini-purple">
                <span>Total Batches</span>
                <strong>1</strong>
              </div>
              <div className="expiry-mini-card expiry-mini-green">
                <span>Stock Value</span>
                <strong>{formatNaira(batchValue)}</strong>
              </div>
            </div>

            <div className="expiry-risk-box">
              <span>₦ Batch Value at Risk</span>
              <strong>{formatNaira(batchValue)}</strong>
              <small>{selectedProduct.quantity} units × {formatNaira(selectedProduct.price)}</small>
            </div>

            <section className="expiry-batches">
              <h4>All Batches for This Product</h4>
              <div className="expiry-batch-row">
                <div>
                  <strong>{selectedProduct.batch} <span>(Current)</span></strong>
                  <small>Qty: {selectedProduct.quantity} • Expires: {selectedProduct.expires}</small>
                </div>
                <b>EXPIRED</b>
              </div>
            </section>

            <section className="expiry-actions-box">
              <h4>Recommended Actions</h4>
              <p>• Remove expired stock immediately to prevent sale</p>
              <p>• Document disposal for inventory records</p>
            </section>

            <button className="expiry-remove-stock-btn" type="button" onClick={openRemovePopup}>
              <Trash2 size={16} /> Remove Expired Stock
            </button>
          </aside>
        </div>
      )}

      {showRemovePopup && removingProduct && (
        <div className="expiry-remove-backdrop" onClick={() => {
          setShowRemovePopup(false)
          setRemovingProduct(null)
        }}>
          <div className="expiry-remove-modal" onClick={(event) => event.stopPropagation()}>
            <div className="expiry-remove-icon">
              <Trash2 size={27} />
            </div>
            <h3>Remove Expired Stock</h3>
            <p>Remove <strong>{removingProduct.quantity} units</strong> of <strong>{removingProduct.name}</strong> from inventory?</p>
            <div className="expiry-remove-note">
              <strong>Note:</strong> This action will log the disposal in activity records and adjust inventory accordingly.
            </div>
            <div className="expiry-remove-actions">
              <button type="button" className="expiry-cancel-remove" onClick={() => {
                setShowRemovePopup(false)
                setRemovingProduct(null)
              }}>Cancel</button>
              <button type="button" className="expiry-confirm-remove" onClick={confirmRemoval}>Confirm Removal</button>
            </div>
          </div>
        </div>
      )}

      {showRemovalSuccess && (
        <div className="expiry-removal-success">
          Expired Stock removed successfully
        </div>
      )}

    </div>
  )
}

export default ExpiryMgm
