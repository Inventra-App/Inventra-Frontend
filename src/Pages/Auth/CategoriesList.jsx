import React, { useState } from 'react'
import { Plus, Search, Eye, SquarePen, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AddCategoryModal from '../../CategoryComponents/catComponents/AddCategoryModal'
import DeleteCategory from '../../CategoryComponents/catComponents/DeleteCategory'
import ViewCategory from '../../CategoryComponents/catComponents/ViewCategory'
import './Css/CategoriesList.css'

const initialCategories = [
  { id: 1, name: 'Beverages', description: 'Soft drinks and carbonated beverages', totalProducts: 45 },
  { id: 2, name: 'Snacks', description: 'Chips, crackers, and other snack items', totalProducts: 32 },
  { id: 3, name: 'Dairy', description: 'Milk, cheese, yogurt, and dairy items', totalProducts: 28 },
  { id: 4, name: 'Bakery', description: 'Bread, pastries, and baked goods', totalProducts: 19 },
  { id: 5, name: 'Frozen Foods', description: 'Frozen meals, ice cream, and frozen items', totalProducts: 24 },
  { id: 6, name: 'Canned Goods', description: 'Canned vegetables, fruits, and preserved foods', totalProducts: 37 },
  { id: 7, name: 'Personal Care', description: 'Toiletries and personal hygiene products', totalProducts: 41 },
  { id: 8, name: 'Meat & Seafood', description: 'Fresh meats, poultry, fish, and seafood', totalProducts: 15 },
  { id: 9, name: 'Produce', description: 'Fresh fruits and seasonal vegetables', totalProducts: 52 },
  { id: 10, name: 'Household', description: 'Cleaning supplies, paper towels, and laundry', totalProducts: 29 },
  { id: 11, name: 'Baby Care', description: 'Diapers, wipes, baby food, and lotions', totalProducts: 12 },
  { id: 12, name: 'Pet Supplies', description: 'Dog food, cat food, toys, and pet care', totalProducts: 18 }
]

const CategoriesList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeViewCategory, setActiveViewCategory] = useState(null)

  if (activeViewCategory) {
    return (
      <ViewCategory 
        category={activeViewCategory} 
        onBack={() => setActiveViewCategory(null)} 
      />
    )
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filteredCategories.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleSaveCategory = (newCat) => {
    const freshCategory = {
      id: Date.now(),
      name: newCat.name,
      description: newCat.description || 'No description provided',
      totalProducts: 0
    }
    setCategories([freshCategory, ...categories])
    setCurrentPage(1)
  }

  const handleOpenDelete = (category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedCategory) return
    const updated = categories.filter(cat => cat.id !== selectedCategory.id)
    setCategories(updated)
    const checkedTotalPages = Math.ceil(updated.length / itemsPerPage)
    if (currentPage > checkedTotalPages && checkedTotalPages > 0) {
      setCurrentPage(checkedTotalPages)
    }
    setIsDeleteOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="cat-page">
      <div className="cat-top">
        <div className="cat-breadcrumb">
          <span className="cat-breadcrumb-link" onClick={() => navigate('/inventory')}>Inventory</span>
          <span>&gt;</span>
          <span className="cat-breadcrumb-current">Categories List</span>
        </div>
      </div>

      <div className="cat-search-bar-row">
        <div className="cat-search-wrapper">
          <Search size={20} className="cat-search-icon" />
          <input
            type="text"
            className="cat-search-input"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <button className="cat-btn-filled" onClick={() => setIsModalOpen(true)}>
          <Plus size={17} /> Add Category
        </button>
      </div>

      <div className="cat-table-container">
        <div className="cat-table-scroll-wrapper">
          <table className="cat-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Total Products</th>
                <th>View</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="cat-name-num">{indexOfFirstItem + index + 1}</td>
                  <td className="cat-name-cell">{category.name}</td>
                  <td className="cat-desc-cell">{category.description}</td>
                  <td><span className="cat-quantity">{category.totalProducts}</span></td>
                  <td>
                    <button className="cat-view-btn" onClick={() => setActiveViewCategory(category)}>
                      <Eye size={14} /> View
                    </button>
                  </td>
                  <td>
                    <div className="cat-action-group">
                      <button className="cat-icon-btn edit">
                        <SquarePen size={20} />
                      </button>
                      <button className="cat-icon-btn delete" onClick={() => handleOpenDelete(category)}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentCategories.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#717182' }}>
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="cat-pagination-bar">
          <div className="cat-pagination-left">
            <span className="cat-pagination-info">
              Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} categories
            </span>
            <div className="cat-page-select-wrapper">
              <label htmlFor="itemsPerPage">Display:</label>
              <select 
                id="itemsPerPage" 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className="cat-page-select"
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`cat-page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

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
        {currentCategories.map((category, index) => (
          <div key={category.id} className="cat-mobile-card">
            <div className="cat-mobile-card-header">
              <div>
                <span className="cat-mobile-index">#{indexOfFirstItem + index + 1}</span>
                <h3 className="cat-mobile-name">{category.name}</h3>
              </div>
              <span className="cat-mobile-badge">{category.totalProducts} Products</span>
            </div>
            <p className="cat-mobile-desc">{category.description}</p>
            <div className="cat-mobile-actions">
              <button className="cat-view-btn" onClick={() => setActiveViewCategory(category)}>
                <Eye size={14} /> View
              </button>
              <div className="cat-action-group">
                <button className="cat-icon-btn edit">
                  <SquarePen size={16} />
                </button>
                <button className="cat-icon-btn delete" onClick={() => handleOpenDelete(category)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCategory}
      />

      <DeleteCategory
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={selectedCategory ? selectedCategory.name : ''}
      />
    </div>
  )
}

export default CategoriesList