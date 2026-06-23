import React, { useEffect, useState } from 'react'
import { AlertTriangle, Package, Calendar, Eye, Box, Truck, Trash2, X } from 'lucide-react'
import './Css/ExpiryMgm.css'
import { getAllProducts, getExpiryAlerts, getInventoryItems } from '../../API/inventoryApi'

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.alerts)) return payload.alerts
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

const getDaysRemaining = (dateValue) => {
  if (!dateValue) return 0
  const today = new Date()
  const expiryDate = new Date(dateValue)
  today.setHours(0, 0, 0, 0)
  expiryDate.setHours(0, 0, 0, 0)
  return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
}

const formatDate = (dateValue) => {
  if (!dateValue) return 'No expiry date'
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')

const getCategoryName = (item, matchedProduct) => {
  const category = getValue(
    item?.categoryName,
    item?.category?.categoryName,
    item?.category?.name,
    item?.product?.categoryName,
    item?.product?.category?.categoryName,
    item?.product?.category?.name,
    matchedProduct?.categoryName,
    matchedProduct?.category?.categoryName,
    matchedProduct?.category?.name,
    matchedProduct?.product?.categoryName,
    matchedProduct?.product?.category?.categoryName,
    matchedProduct?.product?.category?.name,
  )

  return category || 'Uncategorized'
}

const getProductPrice = (item, matchedProduct) => Number(getValue(
  item?.unitPrice,
  item?.price,
  item?.sellingPrice,
  item?.product?.unitPrice,
  item?.product?.price,
  item?.product?.sellingPrice,
  item?.inventory?.unitPrice,
  matchedProduct?.unitPrice,
  matchedProduct?.price,
  matchedProduct?.sellingPrice,
  matchedProduct?.product?.unitPrice,
  matchedProduct?.product?.price,
  matchedProduct?.product?.sellingPrice,
  0,
))

const getProductId = (item) => String(getValue(
  item?.productId?._id,
  item?.productId,
  item?.product?._id,
  '',
))

const findMatchingProduct = (item, products) => {
  const productId = getProductId(item)
  const productName = String(item?.productName ?? item?.product?.productName ?? '').toLowerCase()

  return products.find((product) => {
    const currentId = String(product?._id ?? product?.id ?? product?.productId ?? '')
    const nestedProductId = String(product?.product?._id ?? product?.productId?._id ?? '')
    const currentName = String(product?.productName ?? product?.name ?? '').toLowerCase()
    const nestedProductName = String(product?.product?.productName ?? product?.product?.name ?? '').toLowerCase()

    return (
      (productId && (currentId === productId || nestedProductId === productId)) ||
      (productName && (currentName === productName || nestedProductName === productName))
    )
  })
}

const normalizeExpiryItem = (item, products = []) => {
  const matchedProduct = findMatchingProduct(item, products)
  const days = Number(item?.daysLeft ?? getDaysRemaining(item?.expiryDate))
  const expiredDays = Math.abs(days)

  return {
    id: item?._id ?? item?.productId ?? `${item?.productName}-${item?.expiryDate}`,
    name: item?.productName ?? 'Unnamed Product',
    productId: getProductId(item) || 'N/A',
    category: getCategoryName(item, matchedProduct),
    price: getProductPrice(item, matchedProduct),
    batch: item?.batchCode ?? 'N/A',
    quantity: Number(item?.quantityRemaining ?? item?.inventory?.totalStock ?? 0),
    expires: formatDate(item?.expiryDate),
    daysNumber: days,
    status: days <= 0 ? 'EXPIRED' : 'EXPIRING SOON',
    daysLeft: days <= 0 ? '0d left' : `${days} day${days === 1 ? '' : 's'} left`,
    expiredAgo: days <= 0
      ? `Expired ${expiredDays} day${expiredDays === 1 ? '' : 's'} ago`
      : `${days} day${days === 1 ? '' : 's'} remaining`,
  }
}

const ExpiryMgm = () => {
  const [expiryItems, setExpiryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [removingProduct, setRemovingProduct] = useState(null)
  const [showRemovePopup, setShowRemovePopup] = useState(false)
  const [showRemovalSuccess, setShowRemovalSuccess] = useState(false)

  useEffect(() => {
    const loadExpiryAlerts = async () => {
      setLoading(true)
      setError('')

      try {
        const [response, productsResponse, inventoryResponse] = await Promise.all([
          getExpiryAlerts(),
          getAllProducts().catch(() => []),
          getInventoryItems().catch(() => []),
        ])
        const products = [
          ...getArrayPayload(productsResponse),
          ...getArrayPayload(inventoryResponse),
        ]
        setExpiryItems(getArrayPayload(response).map((item) => normalizeExpiryItem(item, products)))
      } catch (err) {
        console.error('Expiry alerts fetch error:', err)
        setError('Failed to load expiry alerts.')
        setExpiryItems([])
      } finally {
        setLoading(false)
      }
    }

    loadExpiryAlerts()
  }, [])

  const criticalItems = expiryItems.filter((item) => item.daysNumber <= 0)
  const warningItems = expiryItems.filter((item) => item.daysNumber >= 1 && item.daysNumber <= 7)
  const infoItems = expiryItems.filter((item) => item.daysNumber >= 8 && item.daysNumber <= 14)

  const statCards = [
    { label: 'Total Alerts', value: expiryItems.length, color: 'white', bg: 'white-bg' },
    { label: 'Critical', value: criticalItems.length, color: 'red', bg: 'red-bg' },
    { label: 'Warning', value: warningItems.length, color: 'orange', bg: 'orange-bg' },
    { label: 'Info', value: infoItems.length, color: 'yellow', bg: 'yellow-bg' },
  ]

  const formatNaira = (amount) => `₦${Number(amount || 0).toFixed(2)}`
  const batchValue = selectedProduct ? selectedProduct.quantity * selectedProduct.price : 0
  const getProductTone = (product) => {
    if (!product) return 'warning'
    if (product.daysNumber <= 0) return 'expired'
    if (product.daysNumber <= 7) return 'warning'
    return 'info'
  }
  const selectedProductTone = getProductTone(selectedProduct)
  const removingProductTone = getProductTone(removingProduct)
  const selectedProductAlertTitle = selectedProductTone === 'expired'
    ? 'Product Expired'
    : selectedProductTone === 'warning'
      ? 'Product Warning'
      : 'Product Info'
  const selectedProductStatusText = selectedProductTone === 'expired'
    ? 'Expired'
    : selectedProductTone === 'warning'
      ? 'Warning'
      : 'Info'
  const selectedProductSectionText = selectedProductTone === 'expired'
    ? 'Critical'
    : selectedProductTone === 'warning'
      ? 'Warning'
      : 'Info'
  const selectedProductStatusBadge = selectedProductStatusText.toUpperCase()
  const selectedProductActions = {
    expired: [
      'Remove expired stock immediately to prevent sale',
      'Document disposal for inventory records',
    ],
    warning: [
      'Move warning stock forward for quick sale review',
      'Monitor this batch closely before expiry date',
    ],
    info: [
      'Plan stock rotation before the expiry window becomes urgent',
      'Monitor this batch during routine inventory checks',
    ],
  }[selectedProductTone]
  const selectedProductRemoveLabel = `Remove ${selectedProductSectionText} Stock`
  const removingProductLabel = removingProductTone === 'expired'
    ? 'Critical'
    : removingProductTone === 'warning'
      ? 'Warning'
      : 'Info'

  const confirmRemoval = () => {
    setExpiryItems((items) => items.filter((item) => item.id !== removingProduct?.id))
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
          <div key={index} className={`expiry-stat-card expiry-stat-card-${card.bg}`}>
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

      {loading && <p className="expiry-api-message">Loading expiry alerts...</p>}
      {error && <p className="expiry-api-message expiry-api-error">{error}</p>}

      <div className="expiry-section">
        <div className="expiry-section-header">
          <h3>Critical (Expired)</h3>
          <span className="expiry-count expiry-count-red">{criticalItems.length} items</span>
        </div>
        <div className="expiry-list">
          {criticalItems.length === 0 && !loading ? (
            <p className="expiry-api-message">No expired products.</p>
          ) : criticalItems.map((item) => (
            <div key={item.id} className="expiry-item expiry-item-red">
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
          {warningItems.length === 0 && !loading ? (
            <p className="expiry-api-message">No warning expiry alerts.</p>
          ) : warningItems.map((item) => (
            <div key={item.id} className="expiry-item expiry-item-orange">
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
          {infoItems.length === 0 && !loading ? (
            <p className="expiry-api-message">No info expiry alerts.</p>
          ) : infoItems.map((item) => (
            <div key={item.id} className="expiry-item expiry-item-yellow">
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

            <div className={`expiry-detail-alert expiry-detail-alert-${selectedProductTone}`}>
              <AlertTriangle size={20} />
              <div>
                <strong>{selectedProductAlertTitle}</strong>
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
                  <strong className={`expiry-status-text expiry-status-text-${selectedProductTone}`}>
                    {selectedProductStatusText}
                  </strong>
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
                <b className={`expiry-batch-status expiry-batch-status-${selectedProductTone}`}>
                  {selectedProductStatusBadge}
                </b>
              </div>
            </section>

            <section className="expiry-actions-box">
              <h4>Recommended Actions</h4>
              {selectedProductActions.map((action) => (
                <p key={action}>• {action}</p>
              ))}
            </section>

            <button className={`expiry-remove-stock-btn expiry-remove-stock-btn-${selectedProductTone}`} type="button" onClick={openRemovePopup}>
              <Trash2 size={16} /> {selectedProductRemoveLabel}
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
            <h3>Remove {removingProductLabel} Stock</h3>
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
          Stock removed successfully
        </div>
      )}

    </div>
  )
}

export default ExpiryMgm
