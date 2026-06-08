import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import './ModalStyles/AddProductModal.css'

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unitPrice: '',
    initialQuantity: '',
    quantityType: '',
    batchNumber: 'BTH-202606-HGM9',
    expiryDate: ''
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateBatchNumber = () => {
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    setFormData((prev) => ({ ...prev, batchNumber: `BTH-202606-${randomStr}` }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddProduct(formData)
    setFormData({
      name: '',
      category: '',
      unitPrice: '',
      initialQuantity: '',
      quantityType: '', 
      batchNumber: 'BTH-202606-HGM9',
      expiryDate: ''
    })
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Product</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="banana"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="fruits"
              required
            />
          </div>

          <div className="form-group">
            <label>Unit Price (₦) *</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="2000"
              required
            />
          </div>

          <div className="form-group">
            <label>Initial Quantity</label>
            <input
              type="number"
              name="initialQuantity"
              value={formData.initialQuantity}
              onChange={handleChange}
              placeholder="30"
            />
            <span className="field-hint">Leave empty or 0 to add stock later</span>
          </div>

          <div className="form-group">
            <label>Quantity Type</label>
            <input
              type="text"
              name="quantityType"
              value={formData.quantityType}
              onChange={handleChange}
              placeholder="Cartons"
            />
            <span className="field-hint">Leave empty or 0 to add stock later</span>
          </div>

          <div className="form-group">
            <label>Batch Number *</label>
            <div className="batch-input-wrapper">
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
              />
              <button type="button" className="generate-btn" onClick={generateBatchNumber}>
                Generate
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal