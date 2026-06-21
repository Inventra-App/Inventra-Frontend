import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronRight, ArrowLeft, Search, Package } from "lucide-react";
import "../catStyle/CategoryProductPanel.css";

const CategoryProductPanel = ({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  formatNaira,
}) => {
  const [view, setView] = useState("categories");
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setView("categories");
      setActiveCategory(null);
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const categories = React.useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    const q = search.trim().toLowerCase();
    return Object.entries(map)
      .filter(([catName]) => !q || catName.toLowerCase().includes(q))
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [products, search]);

  const filteredProducts = React.useMemo(() => {
    if (view === "products" && activeCategory) {
      const inCategory = products.filter(
        (p) => (p.category || "Uncategorized") === activeCategory,
      );
      const q = search.trim().toLowerCase();
      if (!q) return inCategory;
      return inCategory.filter((p) => p.name?.toLowerCase().includes(q));
    }
    return products;
  }, [products, view, activeCategory, search]);

  const openCategory = useCallback((catName) => {
    setActiveCategory(catName);
    setView("products");
    setSearch("");
  }, []);

  const goBack = useCallback(() => {
    setView("categories");
    setActiveCategory(null);
    setSearch("");
  }, []);

  const handleSelect = useCallback(
    (product) => {
      onSelectProduct(product);
    },
    [onSelectProduct],
  );

  return (
    <>
      {isOpen && (
        <div className="cpp-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        ref={panelRef}
        className={`cpp-panel${isOpen ? " cpp-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Select Category or Product"
      >
        <div className="cpp-header">
          <div className="cpp-header-text">
            {view === "products" ? (
              <>
                <button
                  className="cpp-back-btn"
                  type="button"
                  onClick={goBack}
                  aria-label="Back to categories"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="cpp-title">{activeCategory}</h3>
                  <p className="cpp-subtitle">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="cpp-title">Select Category</h3>
                <p className="cpp-subtitle">
                  Choose a category to browse products
                </p>
              </div>
            )}
          </div>

          <button
            className="cpp-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="cpp-search-wrap">
          <Search size={16} className="cpp-search-icon" />
          <input
            ref={searchRef}
            type="text"
            className="cpp-search-input"
            placeholder={
              view === "products" && activeCategory
                ? `Search in ${activeCategory}...`
                : "Search categories…"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="cpp-search-clear"
              type="button"
              onClick={() => {
                setSearch("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="cpp-body">
          {view === "categories" && (
            <ul className="cpp-category-list" role="list">
              {categories.length === 0 && (
                <li className="cpp-empty">
                  <Package size={32} />
                  <span>No categories found</span>
                </li>
              )}
              {categories.map(([catName, items]) => (
                <li key={catName}>
                  <button
                    className="cpp-category-row"
                    type="button"
                    onClick={() => openCategory(catName)}
                  >
                    <span className="cpp-category-name">{catName}</span>
                    <span className="cpp-category-meta">
                      <span className="cpp-category-count">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                      </span>
                      <ChevronRight size={16} className="cpp-chevron" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {view === "products" && (
            <ul className="cpp-product-list" role="list">
              {filteredProducts.length === 0 && (
                <li className="cpp-empty">
                  <Package size={32} />
                  <span>No products found</span>
                </li>
              )}
              {filteredProducts.map((product) => (
                <li key={product.id} className="cpp-product-card">
                  <div className="cpp-product-card-icon">
                    <Package size={20} />
                  </div>
                  <div className="cpp-product-info">
                    <span className="cpp-product-name">{product.name}</span>
                    <span className="cpp-product-sub">
                      {formatNaira(product.price)} ·{" "}
                      <span
                        className={`cpp-stock-badge${
                          product.stock <= 0
                            ? " cpp-stock-badge--out"
                            : product.stock <= 5
                              ? " cpp-stock-badge--low"
                              : ""
                        }`}
                      >
                        {product.stock <= 0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>
                    </span>
                  </div>
                  <button
                    className={`cpp-add-btn${product.stock <= 0 ? " cpp-add-btn--disabled" : ""}`}
                    type="button"
                    onClick={() => handleSelect(product)}
                    disabled={product.stock <= 0}
                    title={
                      product.stock <= 0
                        ? "Out of stock"
                        : `Add ${product.name}`
                    }
                  >
                    <span>+</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default CategoryProductPanel;
