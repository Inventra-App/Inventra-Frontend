import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pencil, X, Loader2, Save, SquarePen } from "lucide-react";
import "../catStyle/EditCategory.css";

const EditCategory = ({
  isOpen,
  onClose,
  onSave,
  category,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.categoryName || "",
        description: category.description || "",
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...category,
      categoryName: formData.name,
      description: formData.description,
    });
  };

  return createPortal(
    <div className="cat-modal-overlay">
      <div className="cat-edit-container">
        <div className="cat-edit-header">
          <div className="cat-edit-title">
            <SquarePen size={20} />
            <h2>Edit Category</h2>
          </div>

          <button
            type="button"
            className="cat-edit-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cat-edit-form">
          <div className="cat-edit-form-group">
            <label htmlFor="edit-cat-name">
              Change Category Name <span className="cat-edit-required">*</span>
              </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter new category name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="cat-edit-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="cat-edit-actions">
            <button
              type="button"
              className="cat-edit-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cat-edit-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="cat-spin"
                    style={{ marginRight: "6px" }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save
                    size={18}
                    style={{ marginRight: "6px" }}
                  />
                  Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditCategory;