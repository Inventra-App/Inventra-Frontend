import React from 'react'
import { ArrowLeft, Package, FileText, Hash } from 'lucide-react'
import '../../CategoryComponents/catStyle/ViewCategory.css'

const ViewCategory = ({ category, onBack }) => {
  if (!category) return null

  return (
    <div className="cat-page">
      <div className="cat-top">
        <div className="cat-breadcrumb">
          <span className="cat-breadcrumb-link" onClick={onBack}>Categories List</span>
          <span>{'>'}</span>
          <span className="cat-breadcrumb-current">View Category</span>
        </div>
      </div>

      <div className="cat-view-back-row">
        <button className="cat-view-back-btn" onClick={onBack} type="button">
          <ArrowLeft size={18} /> Back to Categories
        </button>
      </div>

      <div className="cat-view-card">
        <div className="cat-view-card-header">
          <div className="cat-view-icon-circle">
            <Package size={26} />
          </div>
          <div>
            <h2 className="cat-view-card-title">{category.name}</h2>
            <p className="cat-view-card-subtitle">Category details and information</p>
          </div>
        </div>

        <div className="cat-view-info-grid">
          <div className="cat-view-info-item">
            <div className="cat-view-info-label">
              <Hash size={16} />
              <span>Category ID</span>
            </div>
            <p className="cat-view-info-value">#{category.id}</p>
          </div>

          <div className="cat-view-info-item">
            <div className="cat-view-info-label">
              <Package size={16} />
              <span>Total Products</span>
            </div>
            <p className="cat-view-info-value">{category.totalProducts}</p>
          </div>

          <div className="cat-view-info-item cat-view-info-full">
            <div className="cat-view-info-label">
              <FileText size={16} />
              <span>Description</span>
            </div>
            <p className="cat-view-info-value">
              {category.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCategory
