import React, { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import './ModalStyles/RecordStockModal.css'
import Logo from '../../Components/Logo'

const generateBatchNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `BTH-${year}${month}-${random}`
}

const RecordStockModal = ({ onClose, visible, onAddProduct }) => {
    if (!visible) return null

  const [product, setProduct] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [quantityReceived, setQuantityReceived] = useState('')
  const [batchNumber, setBatchNumber] = useState(generateBatchNumber())
  const [expiryDate, setExpiryDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [availableStock, setAvailableStock] = useState('')
  const [reservedStock, setReservedStock] = useState('')
  const [success, setSuccess] = useState(false)

  const totalAllocated = (parseInt(availableStock) || 0) + (parseInt(reservedStock) || 0)
  const totalReceived = parseInt(quantityReceived) || 0
  const isAllocated = totalAllocated === totalReceived && totalReceived > 0

  const handleSubmit = (e) => {
    e.preventDefault()
  const qty = parseInt(quantityReceived) || 0
  const avail = parseInt(availableStock) || 0
  const reserved = parseInt(reservedStock) || 0

  let status = 'In Stock'
  if (avail === 0) status = 'Out of Stock'
  else if (avail <= 5) status = 'Low Stock'

  onAddProduct({
    id: `prod-${Date.now()}`,
    name: product,
    batch: batchNumber,
    category: 'General',
    availableStock: avail,
    stockReceived: qty,
    reservedStock: reserved,
    totalStock: avail + reserved,
    status: status,
  })
    setSuccess(true)
  }

if (success) {
  return (
    <div className="record-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="record-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="record-success">

          <div className="record-success-icon">
            <CheckCircle size={36} color="#00A63E" strokeWidth={1.5} />
          </div>

          <h3 className="record-success-title">Success!</h3>
          <p className="record-success-subtitle">Stock Entry: {quantityReceived} units received from {supplierName}</p>

          <div className="record-success-details">
            <div className="record-success-row">
              <span className="record-success-label">Product</span>
              <span className="record-success-value">{product}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Previous Stock</span>
              <span className="record-success-value">0</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Updated Stock</span>
              <span className="record-success-value record-success-green">{quantityReceived}</span>
            </div>
            <div className="record-success-row record-success-row-border">
              <span className="record-success-label">Available Stock</span>
              <span className="record-success-value record-success-green">{availableStock}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Reserved Stock</span>
              <span className="record-success-value record-success-purple">{reservedStock}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Timestamp</span>
              <span className="record-success-timestamp">{new Date().toLocaleString('en-GB')}</span>
            </div>
          </div>

          <button className="record-back-btn" onClick={onClose}>Back to Inventory</button>

        </div>
      </div>
    </div>
  )
}

  return (
    <div className="record-overlay" onClick={onClose}>
      <div className="record-modal" onClick={(e) => e.stopPropagation()}>

        <div className="record-modal-header">
            <Logo variant="black" />
          <button className="record-close" onClick={onClose}><X size={20} /></button>
        </div>

        <h2 className="record-title">Record Incoming Stock</h2>

        <form className="record-form" onSubmit={handleSubmit}>

          <div className="record-card">
            <div className="record-row">
              <div className="record-field">
                <label>Product *</label>
                <input
                  type="text"
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  placeholder="Enter supplier name"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Quantity Received *</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  required
                  min="1"
                  value={quantityReceived}
                  onChange={(e) => setQuantityReceived(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Batch Number *</label>
                <div className="record-batch-row">
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                  <button type="button" className="record-generate-btn" onClick={() => setBatchNumber(generateBatchNumber())}>
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="record-card">
            <h3 className="record-allocation-title">Stock Allocation</h3>
            <p className="record-allocation-sub">Total Received: {totalReceived} units</p>

            <div className="record-row">
              <div className="record-field">
                <label>Available Stock</label>
                <input
                  type="number"
                  min="0"
                  value={availableStock}
                  onChange={(e) => setAvailableStock(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Reserved Stock</label>
                <input
                  type="number"
                  min="0"
                  value={reservedStock}
                  onChange={(e) => setReservedStock(e.target.value)}
                />
              </div>
            </div>

            <div className="record-allocated">
              <span>Allocated: {totalAllocated} / {totalReceived}</span>
              {isAllocated && <CheckCircle size={16} color="#00A63E" />}
            </div>

            <div className="record-actions">
              <button type="button" className="record-cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="record-submit-btn">Record Stock Entry</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default RecordStockModal