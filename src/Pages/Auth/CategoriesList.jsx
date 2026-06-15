import React, { useState, useEffect } from 'react'
import { Plus, Search, Eye, SquarePen, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AddCategoryModal from '../../CategoryComponents/catComponents/AddCategoryModal'
import DeleteCategory from '../../CategoryComponents/catComponents/DeleteCategory'
import ViewCategory from '../../CategoryComponents/catComponents/ViewCategory'
import { getAllCategories, addCategory, deleteCategory } from '../../API/inventoryApi'
import './Css/CategoriesList.css'

const CategoriesList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeViewCategory, setActiveViewCategory] = useState(null)
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

   // In CategoriesList.jsx
    useEffect(() => {
    const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      // The API returns { data: [...] } based on your screenshots
      const categoriesData = res.data || res; 
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
  }, []);

  if (activeViewCategory) {
    return (
      <ViewCategory 
        category={activeViewCategory} 
        onBack={() => setActiveViewCategory(null)} 
      />
    )
  }

  const filteredCategories = categories.filter(cat =>
    (cat?.categoryName || "").toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filteredCategories.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleSaveCategory = async (newCat) => {
    try {
      const res = await addCategory({ 
        categoryName: newCat.name, 
        description: newCat.description 
      });
      const saved = res.data || res;
      setCategories((prev) => [saved, ...prev]);
      setCurrentPage(1);
      setIsModalOpen(false);
      showNotification("Category added successfully!");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return
    try {
      await deleteCategory(selectedCategory._id);
      setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      showNotification("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
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
                <tr key={category._id}>
                  <td className="cat-name-num">{indexOfFirstItem + index + 1}</td>
                  <td className="cat-name-cell">{category.categoryName}</td>
                  <td className="cat-desc-cell">{category.description}</td>
                  <td><span className="cat-quantity">{category.totalProducts || 0}</span></td>
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
            </tbody>
          </table>
        </div>
        <div className="cat-pagination-bar">
          <div className="cat-pagination-left">
            <span className="cat-pagination-info">
              Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} categories
            </span>
          </div>
          {totalPages > 1 && (
            <div className="cat-pagination-controls">
              <button className="cat-page-arrow-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft size={18} />
              </button>
              <button className="cat-page-arrow-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cat-mobile-cards">
        {currentCategories.map((category, index) => (
          <div key={category._id} className="cat-mobile-card">
            <div className="cat-mobile-card-header">
              <div>
                <span className="cat-mobile-index">#{indexOfFirstItem + index + 1}</span>
                <h3 className="cat-mobile-name">{category.categoryName}</h3>
              </div>
              <span className="cat-mobile-badge">{category.totalProducts || 0} Products</span>
            </div>
            <p className="cat-mobile-desc">{category.description}</p>
            <div className="cat-mobile-actions">
              <button className="cat-view-btn" onClick={() => setActiveViewCategory(category)}>
                <Eye size={14} /> View
              </button>
              <div className="cat-action-group">
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
        categoryName={selectedCategory ? selectedCategory.categoryName : ''}
      />
      {notification && (
        <>
        <div className="cat-overlay" />
        <div className="cat-notification">{notification}</div>
        </>
      )}
    </div>
  )
}

export default CategoriesList