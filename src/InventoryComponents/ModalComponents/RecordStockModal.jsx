import React, { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'
import './ModalStyles/RecordStockModal.css'
import Logo from '../../Components/Logo'
import { recordStockEntry, getAllProducts } from '../../API/inventoryApi'

const RecordStockModal = ({ onClose, visible, onAddProduct }) => {
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [packageType, setPackageType] = useState('')
  const [packageQuantity, setPackageQuantity] = useState('')
  const [unitPerPackage, setUnitPerPackage] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [availableStock, setAvailableStock] = useState('')
  const [reservedStock, setReservedStock] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (visible) {
      getAllProducts()
        .then((data) => {
          console.log('Products response:', data)
          const list = data?.data || []
          setProducts(Array.isArray(list) ? [...list].reverse() : [])
        })
        .catch((err) => {
          console.error('Failed to fetch products:', err)
          setProducts([])
        })
    }
  }, [visible])

  if (!visible) return null

  const totalReceived = (parseInt(packageQuantity) || 0) * (parseInt(unitPerPackage) || 0)
  const totalAllocated = (parseInt(availableStock) || 0) + (parseInt(reservedStock) || 0)
  const isAllocated = totalAllocated === totalReceived && totalReceived > 0

  const dateError = deliveryDate && expiryDate && expiryDate <= deliveryDate
    ? 'Expiry date must be after the delivery date.'
    : null

  const allocationError = totalReceived > 0 && totalAllocated !== totalReceived
    ? totalAllocated > totalReceived
      ? `Over-allocated by ${totalAllocated - totalReceived} units`
      : `Under-allocated by ${totalReceived - totalAllocated} units remaining`
    : null

  const resetForm = () => {
    setProductId(''); setSupplierName(''); setPackageType('')
    setPackageQuantity(''); setUnitPerPackage(''); setExpiryDate('')
    setDeliveryDate(''); setAvailableStock(''); setReservedStock('')
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (dateError) {
      setError(dateError)
      return
    }

    if (allocationError || !isAllocated) {
      setError('Please allocate exactly the total received units before submitting.')
      return
    }

    const payload = {
      productId,
      supplier: supplierName,
      expiryDate,
      packageType,
      packageQuantity: parseInt(packageQuantity),
      unitPerPackage: parseInt(unitPerPackage),
      availableStock: parseInt(availableStock),
      reservedStock: parseInt(reservedStock),
    }

    try {
      setLoading(true)
      const res = await recordStockEntry(payload)
      setSuccess(true)
      onAddProduct?.(res?.data?.newBatch)
      setTimeout(() => {
        setSuccess(false)
        resetForm()
        onClose()
      }, 1800)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to record stock entry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="record-overlay">
        <div className="record-modal record-success-modal">
          <CheckCircle size={52} color="#00A63E" />
          <h2>Stock Entry Recorded!</h2>
          <p>The batch has been created and inventory updated.</p>
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

        {error && <div className="record-error">{error}</div>}

        <form className="record-form" onSubmit={handleSubmit}>
          <div className="record-card">
            <div className="record-row">
              <div className="record-field">
                <label>Product *</label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="record-select"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name || p.productName || p.title || 'Unnamed'}
                    </option>
                  ))}
                </select>
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
                <label>Package Type *</label>
                <input
                  type="text"
                  placeholder="e.g. Carton, Box, Bottle"
                  required
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Package Qty *</label>
                <input
                  type="number"
                  placeholder="Enter pkg qty"
                  required
                  min="1"
                  value={packageQuantity}
                  onChange={(e) => setPackageQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Units / Pkg *</label>
                <input
                  type="number"
                  placeholder="Enter units per pkg"
                  required
                  min="1"
                  value={unitPerPackage}
                  onChange={(e) => setUnitPerPackage(e.target.value)}
                />
              </div>
              <div className="record-field">
                <label>Batch Number</label>
                <input
                  type="text"
                  value="SYSTEM GENERATED"
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  max={expiryDate || undefined}
                  onChange={(e) => {
                    setDeliveryDate(e.target.value)
                    setError(null)
                  }}
                />
              </div>
              <div className="record-field">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  min={deliveryDate ? new Date(new Date(deliveryDate).getTime() + 86400000).toISOString().split('T')[0] : undefined}
                  onChange={(e) => {
                    setExpiryDate(e.target.value)
                    setError(null)
                  }}
                />
              </div>
            </div>

            {dateError && (
              <div className="record-allocation-error">
                ⚠ {dateError}
              </div>
            )}
          </div>

          <div className="record-card">
            <h3 className="record-allocation-title">Stock Allocation</h3>
            <p className="record-allocation-sub">Total Received: <strong>{totalReceived}</strong> units</p>

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

            {allocationError && (
              <div className="record-allocation-error">
                ⚠ {allocationError}
              </div>
            )}

            <div className={`record-allocated ${isAllocated ? 'record-allocated--ok' : ''}`}>
              <span>Allocated: {totalAllocated} / {totalReceived}</span>
              {isAllocated && <CheckCircle size={16} color="#00A63E" />}
            </div>

            <div className="record-actions">
              <button type="button" className="record-cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="record-submit-btn" disabled={loading}>
                {loading ? 'Recording...' : 'Record Stock Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecordStockModal