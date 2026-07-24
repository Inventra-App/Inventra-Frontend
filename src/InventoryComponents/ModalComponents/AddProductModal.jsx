import React, { useState, useEffect } from "react";
import { X, Plus, Loader2, ArrowLeft, FolderOpen, Info } from "lucide-react";
import { addInventoryItem, getAllCategories } from "../../API/inventoryApi";
import "./ModalStyles/AddProductModal.css";

const STEPS = { CATEGORY: "category", FORM: "form" };

const AddProductModal = ({
    isOpen,
    onClose,
    onAddProduct,
    onCreateCategory,
    hasExpiry,
}) => {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    unitPrice: "",
    packageQuantity: "",
    unitPerPackage: "",
    availableStock: "",
    reservedStock: "",
    packageType: "",
    expiryDate: "",
    customPackageType: "",
    stockRatio: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetAll();
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!hasExpiry) {
      setFormData((prev) => ({
        ...prev,
        expiryDate: "",
      }));
    }
  }, [hasExpiry]);

  const resetAll = () => {
    setStep(STEPS.CATEGORY);
    setSelectedCategory(null);
    setFormData({
      productName: "",
      unitPrice: "",
      packageQuantity: "",
      unitPerPackage: "",
      availableStock: "",
      reservedStock: "",
      packageType: "",
      expiryDate: "",
      customPackageType: "",
    });
    setServerError("");
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getAllCategories();
      setCategories(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const totalStock =
    Number(formData.packageQuantity || 0) *
    Number(formData.unitPerPackage || 0);

  const remaining =
    totalStock -
    (Number(formData.availableStock || 0) +
      Number(formData.reservedStock || 0));

  const totalQty =
    Number(formData.packageQuantity) * Number(formData.unitPerPackage);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setStep(STEPS.FORM);
  };

  const handleBack = () => {
    setStep(STEPS.CATEGORY);
    setSelectedCategory(null);
    setServerError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "packageQuantity",
      "unitPerPackage",
      "availableStock",
      "reservedStock",
    ];

    if (numericFields.includes(name)) {
      const cleaned = value.replace(/[^0-9]/g, "");

      setFormData((prev) => {
        const updated = {
          ...prev,
          [name]: cleaned,
        };

        const totalStock =
          Number(updated.packageQuantity || 0) *
          Number(updated.unitPerPackage || 0);

        if (name === "availableStock") {
          const available = Number(cleaned || 0);

          updated.reservedStock =
            available > totalStock ? "0" : String(totalStock - available);

          updated.stockRatio = totalStock > 0 ? available / totalStock : 0;
        }

        if (
          (name === "packageQuantity" || name === "unitPerPackage") &&
          updated.stockRatio !== undefined
        ) {
          const newAvailable = Math.round(
            totalStock * Number(updated.stockRatio),
          );

          updated.availableStock = String(newAvailable);
          updated.reservedStock = String(totalStock - newAvailable);
        }

        return updated;
      });

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setIsSubmitting(true);

    const totalQty =
      Number(formData.packageQuantity || 0) *
      Number(formData.unitPerPackage || 0);

    const allocated =
      Number(formData.availableStock || 0) +
      Number(formData.reservedStock || 0);

    if (allocated !== totalQty) {
      setServerError(
        `Available Stock + Backroom Stock must equal Total Stock (${totalQty.toLocaleString()}).`,
      );
      setIsSubmitting(false);
      return;
    }

    if (hasExpiry && !formData.expiryDate) {
      setServerError("Expiry date is required for expiry products.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        productName: formData.productName,
        categoryId: selectedCategory._id,
        unitPrice: Number(formData.unitPrice),
        packageQuantity: Number(formData.packageQuantity),
        unitPerPackage: Number(formData.unitPerPackage),
        packageType:
          formData.packageType === "Other"
            ? formData.customPackageType
            : formData.packageType,
        expiryDate: hasExpiry ? formData.expiryDate : null,
        availableStock: Number(formData.availableStock || 0),
        backroomStock: Number(formData.reservedStock || 0),
      };

      const response = await addInventoryItem(payload);
      console.log("ADD PRODUCT RESPONSE", response);
      onAddProduct(response.data);
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to save product.";
      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 450);
  };

  return (
    <div
      className={`modal-overlay ${
        step === STEPS.FORM ? "add-product-overlay" : ""
      }`}
      onClick={step === STEPS.FORM ? handleClose : undefined}
    >
      <div
        className={`form-container ${
          step === STEPS.FORM ? "add-product-container" : ""
        } ${isClosing ? "closing" : ""}`}
        onClick={step === STEPS.FORM ? (e) => e.stopPropagation() : undefined}
      >
        {step === STEPS.CATEGORY && (
          <>
            <div className="form-header">
              <h2>Select a category</h2>
              <button className="close-btn" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            {categories.length > 0 && (
              <div className="step-progress">
                <span className="step-progress-dot active" />
                <span className="step-progress-dot" />
              </div>
            )}

            <div className="product-form">
              {loadingCategories ? (
                <div className="loading-center">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <div className="category-empty" style={{ paddingBottom: 24 }}>
                  <div className="category-empty-icon">
                    <FolderOpen size={24} />
                  </div>
                  <p className="category-empty-title">No categories yet</p>
                  <p className="category-empty-sub">
                    Create your first category to start adding products to your
                    inventory.
                  </p>
                  <button
                    className="btn-submit"
                    style={{
                      width: "100%",
                      height: "44px",
                      fontSize: "14px",
                      borderRadius: "11px",
                      marginTop: "12px",
                      minHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      alignSelf: "stretch",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      onClose();
                      onCreateCategory?.();
                    }}
                  >
                    <Plus size={16} /> Create a category
                  </button>
                </div>
              ) : (
                <>
                  <p className="category-step-subtitle">
                    Choose a category for this product
                  </p>
                  <ul className="category-list">
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className="category-list-item"
                          onClick={() => handleSelectCategory(cat)}
                        >
                          <span className="category-list-icon">
                            <FolderOpen size={16} />
                          </span>
                          <span className="category-list-info">
                            <span className="category-list-name">
                              {cat.categoryName}
                            </span>
                            {cat.description && (
                              <span className="category-list-desc">
                                {cat.description}
                              </span>
                            )}
                          </span>
                          <span className="category-list-arrow">›</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </>
        )}

        {step === STEPS.FORM && (
          <>
            <div className="form-header">
              <div>
                <button className="form-back-btn" onClick={handleBack}>
                  <ArrowLeft size={13} /> Back
                </button>
                <h2>New Product</h2>
                <span className="form-category-badge">
                  Category:{selectedCategory?.categoryName}
                </span>
              </div>
              <button
                className="close-btn"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>

            <div className="step-progress">
              <span className="step-progress-dot active" />
              <span className="step-progress-dot active" />
            </div>

            {serverError && (
              <div className="error-banner">⚠️ {serverError}</div>
            )}

            <form onSubmit={handleSubmit} className="product-form clean-form">
              <div className="form-group full">
                <label>Product Name *</label>
                <input
                  className="input"
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Milk 1L"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package Type *</label>

                  <select
                    className="input"
                    name="packageType"
                    value={formData.packageType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        packageType: value,
                        customPackageType:
                          value === "Other" ? prev.customPackageType : "",
                      }));
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select package type</option>
                    <option value="Carton">Carton</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Packet">Packet</option>
                    <option value="Can">Can</option>
                    <option value="Loaf">Loaf</option>
                    <option value="Piece">Piece</option>
                    <option value="Piece">Set</option>
                    <option value="Tin">Tin</option>
                    <option value="Bar">Bar</option>
                    <option value="Tube">Tube</option>
                    <option value="Cup">Cup</option>
                    <option value="Bag">Bag</option>
                    <option value="Box">Box</option>
                    <option value="Other">Other</option>
                  </select>

                  {formData.packageType === "Other" && (
                    <input
                      className="input"
                      type="text"
                      name="customPackageType"
                      value={formData.customPackageType}
                      onChange={handleChange}
                      placeholder="Enter custom package type"
                      required
                      disabled={isSubmitting}
                      style={{ marginTop: "8px" }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Price (₦) *</label>
                  <input
                    className="input"
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="tooltip-label">
                    Package Qty *
                    <span className="tooltip-wrapper">
                      <Info size={14} />
                      <span className="tooltip-text">
                        Number of cartons, boxes, bottles, bags, or packages you
                        are adding.
                      </span>
                    </span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="packageQuantity"
                    value={formData.packageQuantity}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(pasted)) {
                        e.preventDefault();
                      }
                    }}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="tooltip2-label">
                    Units Per Package *
                    <span className="tooltip2-wrapper">
                      <Info size={14} />
                      <span className="tooltip2-text">
                        Number of individual items inside one package. Example:
                        1 carton = 24 bottles.
                      </span>
                    </span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="unitPerPackage"
                    value={formData.unitPerPackage}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(pasted)) {
                        e.preventDefault();
                      }
                    }}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Total Stock</label>
                <input
                  className="input"
                  type="text"
                  value={totalStock.toLocaleString()}
                  readOnly
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Available Stock *</label>
                  <input
                    className="input"
                    type="text"
                    name="availableStock"
                    value={formData.availableStock}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (!/^\d+$/.test(pasted)) {
                        e.preventDefault();
                      }
                    }}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>Backroom Stock *</label>
                  <input
                    className="input auto-stock-input"
                    type="text"
                    name="reservedStock"
                    value={formData.reservedStock}
                    readOnly
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "-8px",
                  marginBottom: "12px",
                }}
              >
                Backroom Stock is automatically calculated from Total Stock
                minus Available Stock.
              </p>

              {totalStock > 0 && (
                <p
                  className="stock-allocation-info"
                  style={{
                    marginTop: "-8px",
                    marginBottom: "12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: remaining === 0 ? "#00A63E" : "#ef4444",
                  }}
                >
                  Remaining to allocate: {remaining.toLocaleString()}
                </p>
              )}

              {hasExpiry && (
                <div className="form-group full">
                  <label>Expiry Date</label>
                  <input
                    className="input"
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    min={
                      new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    }
                    required={hasExpiry}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
