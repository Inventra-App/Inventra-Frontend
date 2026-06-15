import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderPlus } from 'lucide-react'
import { addCategory } from '../../API/inventoryApi'
import '../catStyle/AddCategoryModal.css'

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSave({ name: categoryName, description })
      
      setCategoryName('')
      setDescription('')
      onClose()
    } catch (error) {
      console.error("Failed to add category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return createPortal(
    <div className="cat-modal-overlay">
      <div className="cat-modal-container">
        <div className="cat-modal-header">
          <div className="cat-modal-title">
            <FolderPlus size={20} className="cat-modal-title-icon" />
            <h2>Add Category</h2>
          </div>
          <button className="cat-modal-close-btn" onClick={onClose}>
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
    </div>
  )
}

export default AddCategoryModal
