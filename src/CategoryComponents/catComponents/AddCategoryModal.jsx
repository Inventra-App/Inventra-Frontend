import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderPlus } from 'lucide-react'
import '../catStyle/AddCategoryModal.css'

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    
    onSave({ name: categoryName, description })
    setCategoryName('')
    setDescription('')
    onClose()
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

        <form onSubmit={handleSubmit} className="cat-modal-form">
          <div className="cat-modal-field">
            <label>Category Name <span className="cat-modal-required">*</span></label>
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div className="cat-modal-field">
            <label>Description</label>
            <textarea
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="cat-modal-footer">
            <button type="button" className="cat-modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cat-modal-btn-save">
              Save Category
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  )
}

export default AddCategoryModal