import React, { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import '../Css/ManageStockModal.css'

const ManageStockModal = ({ product, onClose }) => {
  if (!product) return null

  const [actionType, setActionType] = useState('')
  const [moveFrom, setMoveFrom] = useState('')
  const [moveTo, setMoveTo] = useState('')
  const [quantity, setQuantity] = useState(10)

  return (
    <div className="manage-overlay" onClick={onClose}>
      <div className="manage-modal" onClick={(e) => e.stopPropagation()}>

        <div className="manage-header">
          <h3>Manage Stock</h3>
          <button className="manage-close" onClick={onClose}>
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
              <select value={moveFrom} onChange={(e) => setMoveFrom(e.target.value)}>
                <option value=""></option>
                <option value="warehouse">Reserved Stock</option>
                <option value="store">Available Stock</option>
              </select>
            </div>
          </div>

          <ArrowRight size={18} className="manage-arrow" />

          <div className="manage-field manage-field-half">
            <label>Move To</label>
            <div className="manage-select-wrapper">
              <select value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
                <option value=""></option>
                <option value="warehouse">Available Stock</option>
                <option value="store">Reserved Stock</option>
              </select>
            </div>
          </div>
        </div>

        <div className="manage-field">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="manage-actions">
          <button className="manage-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="manage-confirm-btn">Confirm Action</button>
        </div>

      </div>
    </div>
  )
}

export default ManageStockModal