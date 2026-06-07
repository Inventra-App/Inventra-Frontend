import React, { useState } from 'react'
import { X, ArrowRight, CheckCircle } from 'lucide-react'
import '../Css/ManageStockModal.css'

const ManageStockModal = ({ product, onClose, onUpdate }) => {
  if (!product) return null

  const [actionType, setActionType] = useState('')
  const [moveFrom, setMoveFrom] = useState('')
  const [moveTo, setMoveTo] = useState('')
  const [quantity, setQuantity] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(quantity)

    let updatedProduct = { ...product }

    if (moveFrom === 'available' && moveTo === 'reserved') {
      updatedProduct.availableStock = product.availableStock - qty
      updatedProduct.reservedStock = product.reservedStock + qty
    } else if (moveFrom === 'reserved' && moveTo === 'available') {
      updatedProduct.reservedStock = product.reservedStock - qty
      updatedProduct.availableStock = product.availableStock + qty
    }

    onUpdate(updatedProduct)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="manage-overlay" onClick={onClose}>
        <div className="manage-success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="manage-success">
            <div className="manage-success-icon">
              <CheckCircle size={36} color="#00A63E" strokeWidth={1.5} />
            </div>
            <h3 className="manage-success-title">Success!</h3>

            <div className="manage-success-details">
              <div className="manage-success-row">
                <span className="manage-success-label">Product</span>
                <span className="manage-success-value">{product.name}</span>
              </div>
              <div className="manage-success-row">
                <span className="manage-success-label">Previous Stock</span>
                <span className="manage-success-value">{product.totalStock}</span>
              </div>
              <div className="manage-success-row">
                <span className="manage-success-label">Updated Stock</span>
                <span className="manage-success-value manage-green">{product.totalStock}</span>
              </div>
              <div className="manage-success-row">
                <span className="manage-success-label">Timestamp</span>
                <span className="manage-success-timestamp">{new Date().toLocaleString('en-GB')}</span>
              </div>
            </div>

            <button className="manage-back-btn" onClick={onClose}>
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="manage-overlay" onClick={onClose}>
      <div className="manage-modal" onClick={(e) => e.stopPropagation()}>

        <div className="manage-header">
          <h3>Manage Stock</h3>
          <button type="button" className="manage-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="manage-product-info">
          <p className="manage-product-name">{product.name}</p>
          <div className="manage-stock-row">
            <div>
              <p className="manage-stock-label">Available Stock</p>
              <p className="manage-stock-value manage-green">{product.availableStock}</p>
            </div>
            <div>
              <p className="manage-stock-label">Reserved Stock</p>
              <p className="manage-stock-value manage-purple">{product.reservedStock}</p>
            </div>
            <div>
              <p className="manage-stock-label">Total Stock</p>
              <p className="manage-stock-value manage-dark">{product.totalStock}</p>
            </div>
          </div>
        </div>

        <form className="manage-form" onSubmit={handleSubmit}>

          <div className="manage-field">
            <label>Action Type</label>
            <input
              type="text"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            />
          </div>

          <div className="manage-move-row">
            <div className="manage-field manage-field-half">
              <label>Move From</label>
              <div className="manage-select-wrapper">
                <select required value={moveFrom} onChange={(e) => setMoveFrom(e.target.value)}>
                  <option value=""></option>
                  <option value="reserved">Reserved Stock</option>
                  <option value="available">Available Stock</option>
                </select>
              </div>
            </div>

            <ArrowRight size={18} className="manage-arrow" />

            <div className="manage-field manage-field-half">
              <label>Move To</label>
              <div className="manage-select-wrapper">
                <select required value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
                  <option value=""></option>
                  <option value="available">Available Stock</option>
                  <option value="reserved">Reserved Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="manage-field">
            <label>Quantity</label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="manage-actions">
            <button type="button" className="manage-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="manage-confirm-btn">Confirm Action</button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default ManageStockModal