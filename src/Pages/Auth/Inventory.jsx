import React, { useState } from 'react'
import { Plus, Search, Package, CalendarDays, AlertCircle } from 'lucide-react'
import './Css/Inventory.css'

const products = [
  { id: 'prod-001', name: 'Fresh Milk', category: 'Dairy', quantity: 45, price: 250.00, batches: 1, hasAlert: true },
  { id: 'prod-002', name: 'White Bread', category: 'Bakery', quantity: 20, price: 150.00, batches: 1, hasAlert: true },
  { id: 'prod-003', name: 'Fresh Eggs (Dozen)', category: 'Poultry', quantity: 8, price: 500.00, batches: 1, hasAlert: false },
  { id: 'prod-004', name: 'Yogurt', category: 'Dairy', quantity: 30, price: 180.00, batches: 1, hasAlert: true },
  { id: 'prod-005', name: 'Orange Juice', category: 'Beverages', quantity: 9, price: 350.00, batches: 1, hasAlert: false },
  { id: 'prod-179029051119-llw2zaxqr', name: 'bag of rice', category: 'food', quantity: 178, price: 32000.00, batches: 1, hasAlert: false },
  { id: 'prod-1779054118381-p3aeze8iq', name: 'SARDINES', category: 'Can item', quantity: 97, price: 1200.00, batches: 1, hasAlert: true },
  { id: 'prod-1779094887714-3i36y40nk', name: 'packet of sugar', category: 'sugar', quantity: 90, price: 1000.00, batches: 1, hasAlert: false },
]

const Inventory = () => {
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="inventory-page">

      <div className="inventory-top">
        <div>
          <h2 className="inventory-title">Inventory Management</h2>
          <p className="inventory-sub">Manage your product inventory</p>
        </div>
        <div className="inventory-actions">
          <button className="inv-btn-outline">
            <Plus size={16} /> Add new product
          </button>
          <button className="inv-btn-filled">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="inventory-search">
        <Search size={18} className="inventory-search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>QUANTITY</th>
              <th>PRICE</th>
              <th>BATCHES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="inv-product-cell">
                    <div className="inv-product-icon">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="inv-product-name">{product.name}</p>
                      <p className="inv-product-id">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="inv-category-tag">{product.category}</span>
                </td>
                <td>
                  <span className={`inv-quantity ${product.quantity <= 10 ? 'inv-quantity-low' : ''}`}>
                    {product.quantity}
                  </span>
                </td>
                <td className="inv-price">₦{product.price.toFixed(2)}</td>
                <td>
                  <div className="inv-batches">
                    {product.batches > 0 ? (
                      <>
                        <span>{product.batches} batch(es)</span>
                        {product.hasAlert && <AlertCircle size={16} className="inv-alert-icon" />}
                      </>
                    ) : (
                      <span className="inv-no-batch">—</span>
                    )}
                  </div>
                </td>
                <td>
                  {product.batches > 0 && (
                    <button className="inv-view-btn">
                      <CalendarDays size={15} /> View Batches
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Inventory