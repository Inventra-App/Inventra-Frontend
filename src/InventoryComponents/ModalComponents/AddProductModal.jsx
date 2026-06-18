import React, { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { addInventoryItem, getAllCategories } from '../../API/inventoryApi'
import './ModalStyles/AddProductModal.css'

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    unitPrice: '',
    packageQuantity: '',
    unitPerPackage: '',
    packageType: '',
    expiryDate: ''
  })

  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [batchNumber, setBatchNumber] = useState('SYSTEM GENERATED')

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        try {
          const res = await getAllCategories()
          setCategories(Array.isArray(res) ? res : (res.data || []))
        } catch (err) {
          console.error("Failed to fetch categories", err)
        }
      }
      fetchCats()
      setFormData({
        productName: '',
        categoryId: '',
        unitPrice: '',
        packageQuantity: '',
        unitPerPackage: '',
        packageType: '',
        expiryDate: ''
      })
      setBatchNumber('SYSTEM GENERATED')
      setServerError('')
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
        categoryId: formData.categoryId,
        unitPrice: Number(formData.unitPrice),
        packageQuantity: Number(formData.packageQuantity),
        unitPerPackage: Number(formData.unitPerPackage),
        packageType: formData.packageType,
        expiryDate: formData.expiryDate
      }

      const response = await addInventoryItem(payload)

      const generatedBatch =
        response?.data?.batch?.batchCode ||
        response?.batch?.batchCode ||
        'NEW-BATCH'

      setBatchNumber(generatedBatch)

      const selectedCategory = categories.find((cat) => cat._id === formData.categoryId)
  const totalQty = Number(formData.packageQuantity) * Number(formData.unitPerPackage)

onAddProduct({
  id: response?.data?.productDetails?.productId || response?.productDetails?.productId || Date.now(),
  name: formData.productName,
  batch: response?.data?.productDetails?.SKU,
  category: selectedCategory?.categoryName || formData.categoryId,
  availableStock: 0,
  stockReceived: 0,
  reservedStock: 0,
  totalStock: totalQty,
  status: totalQty > 10 ? 'In Stock' : totalQty > 0 ? 'Low Stock' : 'Out of Stock',
})

      onClose()
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to save product."
      setServerError(errorMsg)
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
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="category-dropdown-select"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
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
            <input
              type="text"
              value={batchNumber}
              readOnly
              disabled
              className="automated-batch-field"
            />
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