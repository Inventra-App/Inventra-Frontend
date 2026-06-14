import React, { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { addInventoryItem } from '../../API/inventoryApi'
import './ModalStyles/AddProductModal.css'

const initialCategories = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' },
  { id: 3, name: 'Dairy' },
  { id: 4, name: 'Bakery' },
  { id: 5, name: 'Frozen Foods' },
  { id: 6, name: 'Canned Goods' },
  { id: 7, name: 'Personal Care' },
  { id: 8, name: 'Meat & Seafood' },
  { id: 9, name: 'Produce' },
  { id: 10, name: 'Household' }
]

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    categoryText: '',
    unitPrice: '',
    packageQuantity: '',
    unitPerPackage: '',
    packageType: '',
    expiryDate: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productName: '',
        categoryText: '',
        unitPrice: '',
        packageQuantity: '',
        unitPerPackage: '',
        packageType: '',
        expiryDate: ''
      })
      setServerError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setIsSubmitting(true)

    try {
      const payload = {
        productName: formData.productName,
        categoryId: formData.categoryText,
        unitPrice: Number(formData.unitPrice),
        packageQuantity: Number(formData.packageQuantity),
        unitPerPackage: Number(formData.unitPerPackage),
        packageType: formData.packageType,
        expiryDate: formData.expiryDate
      }

      await addInventoryItem(payload)
      onAddProduct()
      onClose()
    } catch (err) {
      console.error("Inventory creation failure:", err)
      setServerError(err?.response?.data?.message || err.message || "Failed to save product.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Product</h2>
          <button type="button" className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {serverError && (
          <div className="error-banner" style={{ color: 'red', marginBottom: '15px', fontWeight: '500', padding: '0 24px' }}>
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g. Coca Cola"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="categoryText"
              value={formData.categoryText}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="category-dropdown-select"
            >
              <option value="" disabled hidden>Select a category</option>
              {initialCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Unit Price (₦) *</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="300"
              required
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row-side">
            <div className="form-group row-item">
              <label>Pkg Qty *</label>
              <input
                type="number"
                name="packageQuantity"
                value={formData.packageQuantity}
                onChange={handleChange}
                placeholder="30"
                required
                min="1"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group row-item">
              <label>Units/Pkg *</label>
              <input
                type="number"
                name="unitPerPackage"
                value={formData.unitPerPackage}
                onChange={handleChange}
                placeholder="24"
                required
                min="1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Quantity Type *</label>
            <input
              type="text"
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
              placeholder="e.g. Cartons"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Batch Number</label>
            <div className="batch-input-wrapper">
              <input
                type="text"
                value="SYSTEM GENERATED"
                readOnly 
                disabled 
                className="automated-batch-field"
              />
              <button type="button" className="generate-btn" disabled>Generate</button>
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
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: '6px' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} /> Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal