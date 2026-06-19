import React from 'react'
import { ArrowLeft, Package, FileText, Hash } from 'lucide-react'
import '../../CategoryComponents/catStyle/ViewCategory.css'

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`

const getProductName = (product) => String(product?.productName ?? product?.name ?? product?.title ?? 'Unnamed Product')
const getProductPrice = (product) => Number(product?.price ?? product?.sellingPrice ?? product?.unitPrice ?? 0)
const getProductStock = (product) => Number(product?.availableStock ?? product?.quantity ?? product?.stock ?? 0)

const ViewCategory = ({ category, products = [], onBack }) => {
  if (!category) return null
  const categoryName = category.categoryName ?? category.name ?? 'Category'
  const categoryId = category._id ?? category.id ?? category.categoryId ?? ''
  const categoryProducts = products.length > 0 ? products : category.products ?? []

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
            <h2 className="cat-view-card-title">{categoryName}</h2>
            <p className="cat-view-card-subtitle">Category details and information</p>
          </div>
        </div>

        <div className="cat-view-info-grid">
          <div className="cat-view-info-item">
            <div className="cat-view-info-label">
              <Hash size={16} />
              <span>Category ID</span>
            </div>
            <p className="cat-view-info-value">#{categoryId}</p>
          </div>

          <div className="cat-view-info-item">
            <div className="cat-view-info-label">
              <Package size={16} />
              <span>Total Products</span>
            </div>
            <p className="cat-view-info-value">{categoryProducts.length}</p>
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

      <div className="cat-view-products-card">
        <div className="cat-view-products-header">
          <div>
            <h3>Products</h3>
            <p>Products assigned to {categoryName}</p>
          </div>
          <span>{categoryProducts.length} product{categoryProducts.length === 1 ? '' : 's'}</span>
        </div>

        {categoryProducts.length === 0 ? (
          <p className="cat-view-products-empty">No products have been added to this category yet.</p>
        ) : (
          <div className="cat-view-products-table-wrap">
            <table className="cat-view-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {categoryProducts.map((product) => (
                  <tr key={product._id ?? product.id ?? getProductName(product)}>
                    <td>{getProductName(product)}</td>
                    <td>{formatNaira(getProductPrice(product))}</td>
                    <td>{getProductStock(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCategory
