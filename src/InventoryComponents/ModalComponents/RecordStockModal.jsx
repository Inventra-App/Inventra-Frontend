import React, { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import './ModalStyles/RecordStockModal.css'
import Logo from '../../Components/Logo'

const RecordStockModal = ({ onClose, visible, onAddProduct }) => {
  if (!visible) return null

  const [product, setProduct] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [packageQuantity, setPackageQuantity] = useState('')
  const [unitPerPackage, setUnitPerPackage] = useState('')
  const [batchNumber, setBatchNumber] = useState('SYSTEM GENERATED')
  const [expiryDate, setExpiryDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [availableStock, setAvailableStock] = useState('')
  const [reservedStock, setReservedStock] = useState('')
  const [success, setSuccess] = useState(false)

  const totalReceived = (parseInt(packageQuantity) || 0) * (parseInt(unitPerPackage) || 0)
  const totalAllocated = (parseInt(availableStock) || 0) + (parseInt(reservedStock) || 0)
  const isAllocated = totalAllocated === totalReceived && totalReceived > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(true)
  }

  if (success) {
    return null 
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
                <input type="text" required value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="record-field">
                <label>Supplier Name *</label>
                <input type="text" placeholder="Enter supplier name" required value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Package Qty *</label>
                <input type="number" placeholder="Enter pkg qty" required min="1" value={packageQuantity} onChange={(e) => setPackageQuantity(e.target.value)} />
              </div>
              <div className="record-field">
                <label>Units/Pkg *</label>
                <input type="number" placeholder="Enter units per pkg" required min="1" value={unitPerPackage} onChange={(e) => setUnitPerPackage(e.target.value)} />
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Batch Number</label>
                <input type="text" value={batchNumber} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
              </div>
              <div className="record-field">
                <label>Expiry Date *</label>
                <input type="date" required value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </div>

            <div className="record-row">
               <div className="record-field">
                <label>Delivery Date *</label>
                <input type="date" required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="record-card">
            <h3 className="record-allocation-title">Stock Allocation</h3>
            <p className="record-allocation-sub">Total Received: {totalReceived} units</p>

            <div className="record-row">
              <div className="record-field">
                <label>Available Stock</label>
                <input type="number" min="0" value={availableStock} onChange={(e) => setAvailableStock(e.target.value)} />
              </div>
              <div className="record-field">
                <label>Reserved Stock</label>
                <input type="number" min="0" value={reservedStock} onChange={(e) => setReservedStock(e.target.value)} />
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