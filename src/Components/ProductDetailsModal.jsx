import React, { useEffect, useState } from 'react'
import { Package, Pencil, X } from 'lucide-react'
import '../Css/ProductDetailsModal.css'

const ProductDetailsModal = ({ product, onClose, onManage }) => {
  if (!product) return null

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()}>

        <div className="inv-modal-header">
          <h3>Product Details</h3>
          <button className="inv-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="inv-modal-product">
          <div className="inv-modal-icon">
            <Package size={30} />
          </div>
          <div>
            <h4>{product.name}</h4>
            <div className="inv-modal-tags">
              <span className="inv-modal-batch-tag">{product.batch}</span>
              <span className="inv-modal-category-tag">{product.category}</span>
            </div>
          </div>
        </div>

        <div className="inv-modal-section">
          <h5>Inventory Information</h5>
          <div className="inv-modal-grid">
            <div>
              <p className="inv-modal-label">Current Stock</p>
              <p className="inv-modal-value">{product.availableStock}</p>
            </div>
            <div>
              <p className="inv-modal-label">Stock Received</p>
              <p className="inv-modal-value inv-modal-blue">{product.stockReceived}</p>
            </div>
            <div>
              <p className="inv-modal-label">Total Stock</p>
              <p className="inv-modal-value inv-modal-green">{product.totalStock}</p>
            </div>
            <div>
              <p className="inv-modal-label">Unit Price</p>
              <p className="inv-modal-value">
                 ₦{Number(product.price || 0).toLocaleString("en-NG", {
                 minimumFractionDigits: 2,
                 })}
              </p>
            </div>
            <div>
              <p className="inv-modal-label">Total Value</p>
              <p className="inv-modal-value inv-modal-green">
                ₦{( Number(product.totalStock || 0) *Number(product.price || 0))
                    .toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div>
              <p className="inv-modal-label">Date Added</p>
              <p className="inv-modal-values">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("en-GB", {
                 day: "2-digit",
                month: "short",
                year: "numeric",
                 })
                 : "-"}
                </p>
            </div>
          </div>
        </div>

        <div className="inv-modal-section">
          <h5>Batch Information</h5>
          <div className="inv-modal-batch-info">
            <p className="inv-modal-batch-id">
              {product.batchCode || "N/A"}
              </p>
            <p className="inv-modal-batch-meta">
              Quantity: {product.availableStock} • Expires: {product.expiryDate 
              ? new Date(product.expiryDate).toLocaleDateString("en-GB", {
               day: "2-digit",
               month: "short",
               year: "numeric"
              }) 
              : "N/A"}
            </p>
          </div>
        </div>

        <div className="inv-modal-section">
          <h5>Stock Movement History</h5>
          <p className="inv-modal-empty">No stock movements recorded</p>
        </div>

        <button className="inv-modal-manage-btn" onClick={onManage}>
          <Pencil size={14} /> Manage Stock
        </button>

      </div>
    </div>
  )
}

export default ProductDetailsModal