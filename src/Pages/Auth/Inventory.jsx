import React, { useState } from 'react'
import { Plus, Search, Package, ClipboardPlus, AlertTriangle, Truck, XCircle, Eye, Pencil, ChevronDown, User, Clock, FolderOpen, Folder } from 'lucide-react'
import './Css/Inventory.css'
import ProductDetailsModal from '../../Components/ProductDetailsModal'
import ManageStockModal from '../../Components/ManageStockModal'
import RecordStockModal from '../../InventoryComponents/ModalComponents/RecordStockModal'
import AddProductModal from '../../InventoryComponents/ModalComponents/AddProductModal'
import ToastNotification from '../../InventoryComponents/ModalComponents/ToastNotification'
import { useNavigate } from 'react-router-dom'

const ITEMS_PER_PAGE = 6
const tabs = ['All Products', 'Stock Entry', 'Low Stock', 'Stock History', 'Out of Stock']

const initialProducts = [
  { id: 'prod-001', name: 'Fresh Milk (1Ltr)', batch: 'Batch0005', category: 'Dairy', availableStock: 45, stockReceived: 20, reservedStock: 50, totalStock: 115, status: 'In Stock' },
  { id: 'prod-002', name: 'white Bread', batch: 'Batch0009', category: 'Bakery', availableStock: 20, stockReceived: 0, reservedStock: 20, totalStock: 40, status: 'In Stock' },
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

const Inventory = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState(initialProducts)
  const [stockEntries, setStockEntries] = useState([
    {
      id: 'entry-001',
      productName: 'banana',
      batch: 'BTH-202606-C6T1',
      quantity: 50,
      expiryDate: 'Jun 25, 2026',
      deliveryDate: 'Jun 02, 2026',
      supplier: 'Vintage fruits',
      user: 'Admin User',
      timestamp: new Date('2026-06-02T10:33:00'),
    },
    {
      id: 'entry-002',
      productName: 'Fresh Milk (1Ltr)',
      batch: 'BTH-202606-M2K9',
      quantity: 100,
      expiryDate: 'Jul 10, 2026',
      deliveryDate: 'Jun 02, 2026',
      supplier: 'FrieslandCampina',
      user: 'Admin User',
      timestamp: new Date('2026-06-02T09:15:00'),
    },
  ])
  const [stockHistory, setStockHistory] = useState([
    {
      id: 'hist-001',
      productName: 'banana',
      action: 'Received',
      units: '+50 units',
      note: 'new',
      user: 'Admin User',
      type: 'received',
      timestamp: new Date('2026-06-02T10:33:00'),
    },
    {
      id: 'hist-002',
      productName: 'banana',
      action: 'Adjusted',
      units: '+30 units',
      note: 'refill',
      user: 'Admin User',
      type: 'adjusted',
      timestamp: new Date('2026-06-02T10:31:00'),
    },
  ])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All Products')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [manageProduct, setManageProduct] = useState(null)
  const [showRecordStock, setShowRecordStock] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const getTabFiltered = () => {
    if (activeTab === 'Low Stock') return productList.filter((p) => p.status === 'Low Stock')
    if (activeTab === 'Out of Stock') return productList.filter((p) => p.status === 'Out of Stock')
    return productList
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

  const totalProducts = productList.length
  const lowStockItems = productList.filter((p) => p.status === 'Low Stock').length
  const stockEntry = stockEntries.length
  const outOfStock = productList.filter((p) => p.status === 'Out of Stock').length

  const getStatusClass = (status) => {
    if (status === 'In Stock') return 'inv-status-instock'
    if (status === 'Low Stock') return 'inv-status-lowstock'
    return 'inv-status-outofstock'
  }

  const getTabIcon = (tabName) => {
    if (tabName === 'Stock Entry') return <ClipboardPlus size={18} className="inv-dropdown-icon-left" />
    if (tabName === 'Low Stock') return <AlertTriangle size={18} className="inv-dropdown-icon-left" />
    if (tabName === 'Stock History') return <Clock size={18} className="inv-dropdown-icon-left" />
    if (tabName === 'Out of Stock') return <XCircle size={18} className="inv-dropdown-icon-left" />
    return <Package size={18} className="inv-dropdown-icon-left" />
  }

  const handleProductUpdate = (updatedProduct) => {
    setProductList((prev) =>
      prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
    )
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct)
    }
  }

  const handleAddProduct = (newProduct, entryData) => {
    setProductList((prev) => [newProduct, ...prev])
    if (entryData) {
      setStockEntries((prev) => [entryData, ...prev])
      setStockHistory((prev) => [{
        id: `hist-${Date.now()}`,
        productName: entryData.productName,
        action: 'Received',
        units: `+${entryData.quantity} units`,
        note: 'new',
        user: entryData.user,
        type: 'received',
        timestamp: entryData.timestamp,
      }, ...prev])
    }
  }

  const handleAddProductFromForm = (newProductData) => {
    const qty = parseInt(newProductData.initialQuantity) || 0
    let initialStatus = 'In Stock'
    if (qty === 0) initialStatus = 'Out of Stock'
    else if (qty <= 5) initialStatus = 'Low Stock'

    const newProduct = {
      id: `prod-${String(productList.length + 1).padStart(3, '0')}`,
      name: newProductData.name,
      batch: newProductData.batchNumber,
      category: newProductData.category,
      availableStock: qty,
      stockReceived: 0,
      reservedStock: qty,
      totalStock: qty,
      status: initialStatus
    }
    setProductList((prev) => [newProduct, ...prev])
    setShowToast(true)
  }

  return (
    <div className="inventory-page">

      <div className="inventory-top">
        <div>
          <h2 className="inventory-title">Inventory Management</h2>
          <p className="inventory-sub">Manage your product inventory</p>
        </div>
        <div className="inventory-actions">
          <button className="inv-btn-outline" onClick={() => navigate('/inventory/categories')}>
            <Folder size={17} /> Categories
          </button>
          <button className="inv-btn-green" onClick={() => setShowRecordStock(true)}>
            <Truck size={17} /> Record Stock Entry
          </button>
          <button className="inv-btn-filled" onClick={() => setShowAddProduct(true)}>
            <Plus size={17} /> Add Product
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
          <div className="inv-stat-icon inv-stat-blue"><Package size={22} /></div>
          <div>
            <p className="inv-stat-label">Total Products</p>
            <h3 className="inv-stat-value">{totalProducts}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-orange"><AlertTriangle size={22} /></div>
          <div>
            <p className="inv-stat-label">Low stock Items</p>
            <h3 className="inv-stat-value">{lowStockItems}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-green"><Truck size={22} /></div>
          <div>
            <p className="inv-stat-label">Stock Entry</p>
            <h3 className="inv-stat-value">{stockEntry}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-red"><XCircle size={22} /></div>
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
              {tab === 'Stock Entry' && <ClipboardPlus size={16} />}
              {tab === 'Low Stock' && <AlertTriangle size={16} />}
              {tab === 'Stock History' && <Clock size={16} />}
              {tab === 'Out of Stock' && <XCircle size={16} />}
              <span>{tab}</span>
              {tab === 'Low Stock' && lowStockItems > 0 && (
                <span className="inv-tab-badge">{lowStockItems}</span>
              )}
            </button>
          ))}
        </div>

        <div className="inv-tab-mobile-wrapper">
          <div className="inv-tab-dropdown-container">
            {getTabIcon(activeTab)}
            <select
              className="inv-tab-dropdown"
              value={activeTab}
              onChange={(e) => { setActiveTab(e.target.value); setCurrentPage(1) }}
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>{tab}</option>
              ))}
            </select>
            <ChevronDown size={18} className="inv-dropdown-icon-right" />
          </div>
        </div>

        {activeTab === 'Stock Entry' ? (
          <div className="stock-entry-list">
            {stockEntries.length === 0 ? (
              <p className="stock-entry-empty">No stock entries recorded yet.</p>
            ) : (
              stockEntries.map((entry) => (
                <div key={entry.id} className="stock-entry-card">
                  <div className="stock-entry-card-top">
                    <div className="stock-entry-card-left">
                      <div className="stock-entry-icon">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="stock-entry-name">{entry.productName}</p>
                        <p className="stock-entry-meta">Batch: {entry.batch} • Quantity: {entry.quantity} units</p>
                        <p className="stock-entry-meta">Expiry: {entry.expiryDate}</p>
                        <div className="stock-entry-user">
                          <User size={13} />
                          <span>{entry.user}</span>
                        </div>
                        <div className="stock-entry-user">
                          <User size={13} />
                          <span>Supplier: {entry.supplier}</span>
                        </div>
                      </div>
                    </div>
                    <div className="stock-entry-time">
                      <p>{entry.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p>{entry.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        ) : activeTab === 'Stock History' ? (
          <div className="stock-entry-list">
            {stockHistory.length === 0 ? (
              <p className="stock-entry-empty">No stock history recorded yet.</p>
            ) : (
              stockHistory.map((item) => (
                <div key={item.id} className="stock-entry-card">
                  <div className="stock-entry-card-top">
                    <div className="stock-entry-card-left">
                      <div className={`stock-entry-icon ${item.type === 'received' ? 'stock-icon-green' : 'stock-icon-purple'}`}>
                        {item.type === 'received' ? <Truck size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <p className="stock-entry-name">{item.productName}</p>
                        <p className="stock-entry-meta">{item.action} • {item.units}</p>
                        <p className="stock-history-note">{item.note}</p>
                        <div className="stock-entry-user">
                          <User size={13} />
                          <span>{item.user}</span>
                        </div>
                      </div>
                    </div>
                    <div className="stock-entry-time">
                      <p>{item.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p>{item.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        ) : activeTab === 'Out of Stock' ? (
          <>
            <div className="inv-desktop-out-of-stock-container">
              <table className="inventory-table text-muted-headers">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>CURRENT STOCK</th>
                    <th>STOCK RECEIVED</th>
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
                          <div className="inv-product-icon"><Package size={20} /></div>
                          <div>
                            <p className="inv-product-name">{product.name}</p>
                            <p className="inv-product-id">{product.batch}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="inv-category-tag">{product.category}</span></td>
                      <td><span className="inv-quantity">{product.availableStock}</span></td>
                      <td><span className={`inv-quantity ${product.stockReceived > 0 ? 'inv-quantity-received' : 'inv-quantity-zero'}`}>{product.stockReceived}</span></td>
                      <td><span className="inv-quantity text-total-stock-green">{product.totalStock}</span></td>
                      <td><span className={`inv-status ${getStatusClass(product.status)}`}>{product.status}</span></td>
                      <td>
                        <div className="inv-actions-cell">
                          <button className="inv-view-btn" onClick={() => setSelectedProduct(product)}><Eye size={14} /> View</button>
                          <button className="inv-adjust-btn" onClick={() => setManageProduct(product)}><Pencil size={14} /> Adjust</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
          </>

        ) : (
          <>
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
                        <div className="inv-product-icon"><Package size={20} /></div>
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

            <div className="inv-mobile-cards">
              {paginated.map((product) => (
                <div key={product.id} className="inv-mobile-card">
                  <div className="inv-mobile-card-top">
                    <div className="inv-mobile-card-product">
                      <div className="inv-product-icon"><Package size={20} /></div>
                      <div>
                        <p className="inv-mobile-card-name">{product.name}</p>
                        <p className="inv-mobile-card-batch">{product.batch}</p>
                      </div>
                    </div>
                    <span className="inv-category-tag">{product.category}</span>
                  </div>
                  <div className="inv-mobile-card-grid">
                    <div className="inv-mobile-card-item">
                      <label>AVAILABLE STOCK</label>
                      <span>{product.availableStock}</span>
                    </div>
                    <div className="inv-mobile-card-item">
                      <label>STOCK RECEIVED</label>
                      <span className="inv-quantity-received">{product.stockReceived}</span>
                    </div>
                    <div className="inv-mobile-card-item">
                      <label>STATUS</label>
                      <div><span className={`inv-status ${getStatusClass(product.status)}`}>{product.status}</span></div>
                    </div>
                    <div className="inv-mobile-card-item">
                      <label>RESERVED STOCK</label>
                      <span className="inv-quantity-reserved">{product.reservedStock}</span>
                    </div>
                    <div className="inv-mobile-card-item">
                      <label>TOTAL STOCK</label>
                      <span>{product.totalStock}</span>
                    </div>
                  </div>
                  <div className="inv-mobile-card-actions">
                    <button className="inv-view-btn" onClick={() => setSelectedProduct(product)}>
                      <Eye size={13} /> View
                    </button>
                    <button className="inv-manage-btn" onClick={() => setManageProduct(product)}>
                      <Pencil size={13} /> Manage stock
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        )}

      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onManage={() => { setManageProduct(selectedProduct); setSelectedProduct(null) }}
      />
      <ManageStockModal
        product={manageProduct}
        onClose={() => setManageProduct(null)}
        onUpdate={handleProductUpdate}
      />
      <RecordStockModal
        onClose={() => setShowRecordStock(false)}
        visible={showRecordStock}
        onAddProduct={handleAddProduct}
      />
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onAddProduct={handleAddProductFromForm}
      />
      <ToastNotification
        message="Changes saved successfully"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

    </div>
  )
}

export default Inventory