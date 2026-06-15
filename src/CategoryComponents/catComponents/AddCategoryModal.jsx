import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderPlus, Loader2, Plus } from 'lucide-react'
import '../catStyle/AddCategoryModal.css'

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    setIsSubmitting(true)
    setError(null)
    try {
      await onSave(formData)
      setFormData({ name: '', description: '' })
      onClose()
    } catch (err) {
      setError("Failed to add category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="cat-modal-overlay">
      <div className="cat-add-container">
        <div className="cat-add-header">
          <div className="cat-add-title">
            <FolderPlus size={20} />
            <h2>Add Category</h2>
          </div>
          <button type="button" className="cat-add-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="cat-add-error-banner">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cat-add-form">
          <div className="cat-add-form-group">
            <label htmlFor="cat-name">Category Name *</label>
            <input
              id="cat-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Beverages"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="cat-add-form-group">
            <label htmlFor="cat-desc">Description</label>
            <textarea
              id="cat-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe this category (optional)"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="cat-add-actions">
            <button
              type="button"
              className="cat-add-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cat-add-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="cat-spin" style={{ marginRight: '6px' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} style={{ marginRight: '6px' }} />
                  Add Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddCategoryModal