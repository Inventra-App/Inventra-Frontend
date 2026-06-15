import React, { useState } from 'react' // Import useState
import { Trash2 } from 'lucide-react'
import '../../CategoryComponents/catStyle/DeleteCategory.css'

const DeleteCategory = ({ isOpen, onClose, onConfirm, categoryName }) => {
  const [isDeleting, setIsDeleting] = useState(false); // New state

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) onClose()
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(); // Await the API call
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }

  return (
    <div className="cat-modal-overlay" onClick={handleOverlayClick}>
      <div className="cat-delete-container" onClick={(e) => e.stopPropagation()}>
        <div className="cat-delete-icon-wrapper">
          <div className="cat-delete-icon-circle">
            <Trash2 size={28} />
          </div>
        </div>

        <h2 className="cat-delete-title">Delete Category</h2>
        <p className="cat-delete-text">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>

        <div className="cat-delete-target-box">
          <span className="cat-delete-target-label">Category:</span>
          <span className="cat-delete-target-value">
            {categoryName || 'Untitled'}
          </span>
        </div>

        <div className="cat-delete-footer">
          <button
            type="button"
            className="cat-delete-btn-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`cat-delete-btn-confirm ${isDeleting ? 'loading' : ''}`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCategory