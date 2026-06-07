import React, { useState } from 'react'
import { Plus, Search, Package, AlertTriangle, Truck, XCircle, Eye, Pencil } from 'lucide-react'
import './Css/Inventory.css'
import ProductDetailsModal from '../../Components/ProductDetailsModal'
import ManageStockModal from '../../Components/ManageStockModal'

const products = [
  { id: 'prod-001', name: 'Fresh Milk', batch: 'Batch0005', category: 'Dairy', availableStock: 45, stockReceived: 20, reservedStock: 50, totalStock: 115, status: 'In Stock' },
  { id: 'prod-002', name: 'White Bread', batch: 'Batch0009', category: 'Bakery', availableStock: 20, stockReceived: 0, reservedStock: 20, totalStock: 40, status: 'In Stock' },
  { id: 'prod-003', name: 'Fresh Eggs (Dozen)', batch: 'Batch0709', category: 'Poultry', availableStock: 8, stockReceived: 0, reservedStock: 8, totalStock: 16, status: 'In Stock' },
  { id: 'prod-004', name: 'Yogurt', batch: 'Batch0067', category: 'Dairy', availableStock: 30, stockReceived: 0, reservedStock: 30, totalStock: 60, status: 'In Stock' },
  { id: 'prod-005', name: 'Orange Juice', batch: 'Batch0059', category: 'Beverages', availableStock: 0, stockReceived: 0, reservedStock: 15, totalStock: 15, status: 'Out of Stock' },
  { id: 'prod-006', name: 'banana', batch: 'Batch0007', category: 'fruits', availableStock: 80, stockReceived: 50, reservedStock: 130, totalStock: 210, status: 'In Stock' },
  { id: 'prod-007', name: 'SARDINES', batch: 'Batch0012', category: 'Can item', availableStock: 5, stockReceived: 0, reservedStock: 5, totalStock: 10, status: 'Low Stock' },
  { id: 'prod-008', name: 'packet of sugar', batch: 'Batch0034', category: 'sugar', availableStock: 90, stockReceived: 10, reservedStock: 100, totalStock: 200, status: 'In Stock' },
  { id: 'prod-009', name: 'Fresh Milk 2', batch: 'Batch0088', category: 'Dairy', availableStock: 60, stockReceived: 30, reservedStock: 90, totalStock: 180, status: 'In Stock' },
  { id: 'prod-010', name: 'Corn Flakes', batch: 'Batch0091', category: 'Cereals', availableStock: 0, stockReceived: 0, reservedStock: 20, totalStock: 20, status: 'Out of Stock' },
  { id: 'prod-011', name: 'Peak Milk', batch: 'Batch0045', category: 'Dairy', availableStock: 25, stockReceived: 15, reservedStock: 40, totalStock: 80, status: 'In Stock' },
  { id: 'prod-012', name: 'Indomie Noodles', batch: 'Batch0023', category: 'food', availableStock: 3, stockReceived: 0, reservedStock: 3, totalStock: 6, status: 'Low Stock' },
]

const ITEMS_PER_PAGE = 6

const tabs = ['All Products', 'Stock Entry', 'Low Stock', 'Stock History', 'Out of Stock']

const Inventory = () => {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All Products')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [manageProduct, setManageProduct] = useState(null)

  const getTabFiltered = () => {
    if (activeTab === 'Low Stock') return products.filter((p) => p.status === 'Low Stock')
    if (activeTab === 'Out of Stock') return products.filter((p) => p.status === 'Out of Stock')
    return products
  }

  const tabFiltered = getTabFiltered()

  const filtered = tabFiltered.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }

  const totalProducts = products.length
  const lowStockItems = products.filter((p) => p.status === 'Low Stock').length
  const stockEntry = products.filter((p) => p.stockReceived > 0).length
  const outOfStock = products.filter((p) => p.status === 'Out of Stock').length

  const getStatusClass = (status) => {
    if (status === 'In Stock') return 'inv-status-instock'
    if (status === 'Low Stock') return 'inv-status-lowstock'
    return 'inv-status-outofstock'
  }

  return (
    <div className="inventory-page">

      <div className="inventory-top">
        <div>
          <h2 className="inventory-title">Inventory Management</h2>
          <p className="inventory-sub">Manage your product inventory</p>
        </div>
        <div className="inventory-actions">
          <button className="inv-btn-green">
            <Truck size={19} /> Record Stock Entry
          </button>
          <button className="inv-btn-filled">
            <Plus size={19} /> Add Product
          </button>
        </div>
      </div>

      <div className="inventory-search">
        <Search size={20} className="inventory-search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
        />
      </div>

      <div className="inventory-stats">
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-blue"><Package size={24} /></div>
          <div>
            <p className="inv-stat-label">Total Products</p>
            <h3 className="inv-stat-value">{totalProducts}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-orange"><AlertTriangle size={24} /></div>
          <div>
            <p className="inv-stat-label">Low Stock Items</p>
            <h3 className="inv-stat-value">{lowStockItems}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-green"><Truck size={24} /></div>
          <div>
            <p className="inv-stat-label">Stock Entry</p>
            <h3 className="inv-stat-value">{stockEntry}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-red"><XCircle size={24} /></div>
          <div>
            <p className="inv-stat-label">Out of Stock</p>
            <h3 className="inv-stat-value">{outOfStock}</h3>
          </div>
        </div>
      </div>

      <div className="inventory-table-wrapper">
        <div className="inv-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`inv-tab ${activeTab === tab ? 'inv-tab-active' : ''}`}
              onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
            >
              {tab === 'All Products' && <Package size={16} />}
              {tab === 'Stock Entry' && <Truck size={16} />}
              {tab === 'Low Stock' && <AlertTriangle size={16} />}
              {tab === 'Stock History' && <Package size={16} />}
              {tab === 'Out of Stock' && <XCircle size={16} />}
              {tab}
            </button>
          ))}
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>AVAILABLE STOCK</th>
              <th>STOCK RECEIVED</th>
              <th>RESERVED STOCK</th>
              <th>TOTAL STOCK</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="inv-product-cell">
                    <div className="inv-product-icon">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="inv-product-name">{product.name}</p>
                      <p className="inv-product-id">{product.batch}</p>
                    </div>
                  </div>
                </td>
                <td><span className="inv-category-tag">{product.category}</span></td>
                <td><span className="inv-quantity">{product.availableStock}</span></td>
                <td><span className={`inv-quantity ${product.stockReceived > 0 ? 'inv-quantity-received' : 'inv-quantity-zero'}`}>{product.stockReceived}</span></td>
                <td><span className="inv-quantity inv-quantity-reserved">{product.reservedStock}</span></td>
                <td><span className="inv-quantity">{product.totalStock}</span></td>
                <td><span className={`inv-status ${getStatusClass(product.status)}`}>{product.status}</span></td>
                <td>
                  <div className="inv-actions-cell">
                    <button className="inv-view-btn" onClick={() => setSelectedProduct(product)}><Eye size={14} /> View</button>
                    <button className="inv-manage-btn" onClick={() => setManageProduct(product)}><Pencil size={14} /> Manage stock</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="inv-footer">
          <p>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} actions</p>
          <div className="inv-pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages}>›</button>
            <span>4 per page ▾</span>
          </div>
        </div>
      </div>
      <ProductDetailsModal 
      product={selectedProduct} 
      onClose={() => setSelectedProduct(null)}
      onManage={() => { setManageProduct(selectedProduct); setSelectedProduct(null) }}
      />
        <ManageStockModal product={manageProduct} onClose={() => setManageProduct(null)} />

    </div>
  )
}

export default Inventory