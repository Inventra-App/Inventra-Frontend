import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import '../catStyle/ViewCategory.css'

const categoryProductsData = {
  'Beverages': [
    { id: 1, name: 'Coca Cola 500ml', sku: 'BEV-CC-500', unit: 'Bottle', price: 250, stock: 250, status: 'In Stock' },
    { id: 2, name: 'Fanta Orange 500ml', sku: 'BEV-FO-500', unit: 'Bottle', price: 250, stock: 320, status: 'In Stock' },
    { id: 3, name: 'Sprite 500ml', sku: 'BEV-SP-500', unit: 'Bottle', price: 250, stock: 20, status: 'Low Stock' },
    { id: 4, name: 'Pepsi 500ml', sku: 'BEV-PP-500', unit: 'Bottle', price: 250, stock: 0, status: 'Out of Stock' },
    { id: 5, name: '7up 500ml', sku: 'BEV-7U-500', unit: 'Bottle', price: 250, stock: 15, status: 'Low Stock' },
    { id: 6, name: 'Mountain Dew 500ml', sku: 'BEV-MD-500', unit: 'Bottle', price: 280, stock: 100, status: 'In Stock' },
    { id: 7, name: 'Mirinda Orange 500ml', sku: 'BEV-MO-500', unit: 'Bottle', price: 250, stock: 150, status: 'In Stock' },
    { id: 8, name: 'Maltina Can', sku: 'BEV-MC-330', unit: 'Can', price: 400, stock: 85, status: 'In Stock' },
    { id: 9, name: 'Eva Water 75cl', sku: 'BEV-EW-750', unit: 'Bottle', price: 150, stock: 500, status: 'In Stock' }
  ],
  'Snacks': [
    { id: 10, name: 'Pringles Onion 165g', sku: 'SNA-PR-165', unit: 'Can', price: 1200, stock: 45, status: 'In Stock' },
    { id: 11, name: 'Potato Chips Salted', sku: 'SNA-PC-50', unit: 'Pack', price: 350, stock: 120, status: 'In Stock' },
    { id: 12, name: 'Chin Chin Medium', sku: 'SNA-CC-200', unit: 'Pack', price: 500, stock: 8, status: 'Low Stock' },
    { id: 13, name: 'Roasted Peanuts', sku: 'SNA-RP-100', unit: 'Bottle', price: 600, stock: 0, status: 'Out of Stock' },
    { id: 14, name: 'Chocolate Cookies', sku: 'SNA-CK-150', unit: 'Pack', price: 800, stock: 60, status: 'In Stock' },
    { id: 15, name: 'Gala Sausage Roll', sku: 'SNA-SR-80', unit: 'Piece', price: 150, stock: 200, status: 'In Stock' },
    { id: 16, name: 'Plantain Chips Spicy', sku: 'SNA-PL-100', unit: 'Pack', price: 300, stock: 15, status: 'Low Stock' },
    { id: 17, name: 'Popcorn Caramelized', sku: 'SNA-PC-150', unit: 'Pack', price: 700, stock: 35, status: 'In Stock' }
  ],
  'Dairy': [
    { id: 18, name: 'Peak Milk Powder 400g', sku: 'DAI-PM-400', unit: 'Sachet', price: 2800, stock: 90, status: 'In Stock' },
    { id: 19, name: 'Hollandia Full Cream 1L', sku: 'DAI-HF-1000', unit: 'Carton', price: 1500, stock: 110, status: 'In Stock' },
    { id: 20, name: 'Dano Slim Milk 1L', sku: 'DAI-DS-1000', unit: 'Carton', price: 1400, stock: 4, status: 'Low Stock' },
    { id: 21, name: 'Sweetened Yogurt 500ml', sku: 'DAI-SY-500', unit: 'Bottle', price: 900, stock: 75, status: 'In Stock' },
    { id: 22, name: 'Cheddar Cheese Block', sku: 'DAI-CC-250', unit: 'Pack', price: 3200, stock: 0, status: 'Out of Stock' },
    { id: 23, name: 'Unsalted Butter 250g', sku: 'DAI-UB-250', unit: 'Pack', price: 1800, stock: 28, status: 'In Stock' },
    { id: 24, name: 'Condensed Milk Can', sku: 'DAI-CM-390', unit: 'Can', price: 950, stock: 14, status: 'Low Stock' },
    { id: 25, name: 'Fresh Whipping Cream', sku: 'DAI-WC-500', unit: 'Pack', price: 2400, stock: 40, status: 'In Stock' }
  ]
}

const ViewCategory = ({ category, onBack }) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  if (!category) return null

  const categoryProducts = categoryProductsData[category.name] || [
    { id: 999, name: `${category.name} Sample Item`, sku: `GEN-${category.name.substring(0,3).toUpperCase()}-01`, unit: 'Item', price: 500, stock: 50, status: 'In Stock' }
  ]

  const filteredProducts = categoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.sku.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...', totalPages)
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage, '...', totalPages)
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return <span key={`ellipsis-${index}`} className="cat-page-ellipsis">...</span>
      }
      return (
        <button
          key={`page-${page}`}
          className={`cat-page-num-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      )
    })
  }

  return (
    <div className="cat-page">
      <div className="cat-top">
        <div className="cat-breadcrumb">
          <span className="cat-breadcrumb-link" onClick={onBack}>Inventory</span>
          <span>&gt;</span>
          <span className="cat-breadcrumb-link" onClick={onBack}>Category List</span>
          <span>&gt;</span>
          <span className="cat-breadcrumb-current">{category.name}</span>
        </div>
      </div>

      <div className="cat-search-bar-row">
        <div className="cat-search-wrapper">
          <Search size={20} className="cat-search-icon" />
          <input
            type="text"
            className="cat-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="cat-select-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="cat-status-select"
          >
            <option value="All Status">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="cat-table-container">
        <div className="cat-table-scroll-wrapper">
          <table className="cat-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>SKU Code</th>
                <th>Unit</th>
                <th>Price (₦)</th>
                <th>Total Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={product.id}>
                  <td className="cat-name-num">{indexOfFirstItem + index + 1}</td>
                  <td className="cat-name-cell">{product.name}</td>
                  <td className="cat-desc-cell">{product.sku}</td>
                  <td className="cat-quantity">{product.unit}</td>
                  <td className="cat-quantity">₦{product.price}</td>
                  <td className="cat-quantity">{product.stock}</td>
                  <td>
                    <span className={`cat-status-badge ${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
              {currentProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#717182' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="cat-pagination-bar">
          <div className="cat-pagination-left">
            <span className="cat-pagination-info">
              Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} products
            </span>
          </div>

          {totalPages > 1 && (
            <div className="cat-pagination-controls">
              <button
                className="cat-page-arrow-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {renderPageNumbers()}

              <button
                className="cat-page-arrow-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cat-mobile-cards">
        {currentProducts.map((product, index) => (
          <div key={product.id} className="cat-mobile-card">
            <div className="cat-mobile-card-header">
              <div>
                <span className="cat-mobile-index">#{indexOfFirstItem + index + 1}</span>
                <h3 className="cat-mobile-name">{product.name}</h3>
              </div>
              <span className={`cat-status-badge ${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {product.status}
              </span>
            </div>
            <div className="cat-mobile-info-row">
              <span>SKU: {product.sku}</span>
              <span>Unit: {product.unit}</span>
            </div>
            <div className="cat-mobile-info-row text-highlight">
              <span>Price: ₦{product.price}</span>
              <span>Stock: {product.stock}</span>
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="cat-mobile-pagination">
            <button
              className="cat-view-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="cat-pagination-info">Page {currentPage} of {totalPages}</span>
            <button
              className="cat-view-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCategory