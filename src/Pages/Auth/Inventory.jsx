import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Package,
  ClipboardPlus,
  AlertTriangle,
  Truck,
  XCircle,
  Eye,
  Pencil,
  ChevronDown,
  User,
  Clock,
  Folder,
} from "lucide-react";
import "./Css/Inventory.css";
import ProductDetailsModal from "../../Components/ProductDetailsModal";
import ManageStockModal from "../../Components/ManageStockModal";
import RecordStockModal from "../../InventoryComponents/ModalComponents/RecordStockModal";
import AddProductModal from "../../InventoryComponents/ModalComponents/AddProductModal";
import ToastNotification from "../../InventoryComponents/ModalComponents/ToastNotification";
import {
  getInventoryItems,
  addInventoryItem,
  getAllProducts,
  getLowStockAlerts,
} from "../../API/inventoryApi";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;
const tabs = [
  "All Products",
  "Stock Entry",
  "Low Stock",
  "Stock History",
  "Out of Stock",
];

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.alerts)) return payload.alerts;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
};

const normalizeLowStockItem = (item) => {
  console.log("Low Stock Item:", item);

  const product = item?.productId; 

  const availableStock = Number(item?.availableStock ?? 0);
  const totalStock = Number(item?.totalStock ?? 0);

  console.log("Stock Debug:", {
  product: item?.productId?.productName,
  availableStock,
  totalStock,
  rawAvailableStock: item?.availableStock,
});

  return {
    id: item?._id ?? item?.id,

    name:
      product?.productName ??
      item?.productName ??
      "Unnamed Product",

    category:
      item?.categoryName ??
      product?.categoryName ??
      "Uncategorized",

    batch:
      item?.SKU ??
      item?.batch ??
      product?.SKU ??
      "N/A",

    availableStock,
    totalStock,
    stockReceived: 0,
    reservedStock: Number(item?.reservedStock ?? 0),

    status: "Low Stock",
  };
};

const Inventory = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [lowStockAlertItems, setLowStockAlertItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockEntries, setStockEntries] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manageProduct, setManageProduct] = useState(null);
  const [showRecordStock, setShowRecordStock] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const [productsRes, inventoryRes] = await Promise.all([
      getAllProducts({ _t: Date.now() }),
      getInventoryItems({ _t: Date.now() }),
    ]);

    const products = Array.isArray(productsRes)
      ? productsRes
      : productsRes?.data || [];
    const inventory = Array.isArray(inventoryRes)
      ? inventoryRes
      : inventoryRes?.data || [];

    const stored = JSON.parse(localStorage.getItem('stockReceived') || '{}')

    const mapped = products.map((prod) => {
      const inv = inventory.find((i) => i.productId === prod._id) || {};
      const total = Number(inv.totalStock) || 0;
      const reorderLevel = Number(prod.reorderLevel) || 10;
      const status =
        total > reorderLevel
          ? "In Stock"
          : total > 0
            ? "Low Stock"
            : "Out of Stock";

      return {
        _id: prod._id,
        inventoryId: inv._id,
        id: prod._id,
        name: prod.productName || "Unnamed Product",
        category: prod.categoryName || "Uncategorized",
        batch: prod.SKU || "N/A",
        availableStock: Number(inv.availableStock) || 0,
        totalStock: total,
        reservedStock: Number(inv.reservedStock) || 0,
        stockReceived: stored[prod._id] || 0, 
        status: status,
      };
    });
    mapped.reverse();
    setProductList(mapped);
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setLoading(false);
  }
}, []);

  const fetchLowStockAlerts = useCallback(async () => {
    try {
      const response = await getLowStockAlerts()
      console.log("LOW STOCK API RESPONSE:", response);
      setLowStockAlertItems(getArrayPayload(response).map(normalizeLowStockItem))
    } catch (err) {
      console.error("Low stock alerts fetch error:", err);
      setLowStockAlertItems([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchLowStockAlerts();
  }, [fetchProducts, fetchLowStockAlerts]);

  const handleSaveNewProduct = (newProduct) => {
    setProductList((prev) => [newProduct, ...prev]);
    setShowToast(true);
  };

  const getTabFiltered = useCallback(() => {
    if (activeTab === "Low Stock") return lowStockAlertItems;
    if (activeTab === "Out of Stock")
      return productList.filter((p) => p.status === "Out of Stock");
    return productList;
  }, [activeTab, productList, lowStockAlertItems]);

  const tabFiltered = getTabFiltered();

  const filtered = tabFiltered.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalProducts = productList.length;
  const lowStockItems = lowStockAlertItems.length;
  const stockEntry = stockEntries.length;
  const outOfStock = productList.filter(
    (p) => p.status === "Out of Stock",
  ).length;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleProductUpdate = () => {
    fetchProducts();
    fetchLowStockAlerts();
  };

  const handleAddProduct = (newBatch) => {
  if (!newBatch) return

  const storedEntries = JSON.parse(localStorage.getItem('stockEntries') || '[]')
  const productName = productList.find((p) => p._id === newBatch.productId)?.name || 'Unknown'
  
  const newEntry = {
    id: newBatch._id,
    productName,
    batch: newBatch.batchCode,
    quantity: newBatch.quantity,
    supplier: newBatch.supplier,
    expiryDate: new Date(newBatch.expiryDate).toLocaleDateString('en-GB'),
    user: 'You',
    timestamp: new Date(newBatch.createdAt || Date.now()).toISOString(),
  }

  const updatedEntries = [newEntry, ...storedEntries]
  localStorage.setItem('stockEntries', JSON.stringify(updatedEntries))
  setStockEntries(updatedEntries.map(e => ({ ...e, timestamp: new Date(e.timestamp) })))

  const stored = JSON.parse(localStorage.getItem('stockReceived') || '{}')
  stored[newBatch.productId] = newBatch.quantity
  localStorage.setItem('stockReceived', JSON.stringify(stored))

  fetchProducts()
  fetchLowStockAlerts()
}

useEffect(() => {
  const storedEntries = JSON.parse(localStorage.getItem('stockEntries') || '[]')
  setStockEntries(storedEntries.map(e => ({ ...e, timestamp: new Date(e.timestamp) })))
}, [])

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "inv-status-instock";
      case "Low Stock":
        return "inv-status-lowstock";
      case "Out of Stock":
        return "inv-status-outofstock";
      default:
        return "";
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case "All Products":
        return <Package size={16} />;
      case "Stock Entry":
        return <ClipboardPlus size={16} />;
      case "Low Stock":
        return <AlertTriangle size={16} />;
      case "Stock History":
        return <Clock size={16} />;
      case "Out of Stock":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const renderEmptyState = (message) => (
    <div className="inv-empty-state">
      <Package size={40} className="inv-empty-icon" />
      <p>{message}</p>
    </div>
  );

  const renderTable = () => {
    if (loading) {
      return <div className="inv-loading">Loading products...</div>;
    }

    if (filtered.length === 0) {
      return renderEmptyState(
        search
          ? `No products found for "${search}"`
          : "No products available yet.",
      );
    }

    return (
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
            {paginated.map((product, index) => (
              <tr key={product.id || index}>
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
                <td>
                  <span className="inv-category-tag">{product.category}</span>
                </td>
                <td>
                  <span className="inv-quantity">{product.availableStock}</span>
                </td>
                <td>
                  <span
                    className={`inv-quantity ${product.stockReceived > 0 ? "inv-quantity-received" : "inv-quantity-zero"}`}
                  >
                    {product.stockReceived}
                  </span>
                </td>
                <td>
                  <span className="inv-quantity inv-quantity-reserved">
                    {product.reservedStock}
                  </span>
                </td>
                <td>
                  <span className="inv-quantity">{product.totalStock}</span>
                </td>
                <td>
                  <span
                    className={`inv-status ${getStatusClass(product.status)}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="inv-actions-cell">
                    <button
                      className="inv-view-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="inv-manage-btn"
                      onClick={() => setManageProduct(product)}
                    >
                      <Pencil size={14} /> Manage stock
                    </button>
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
                  <div className="inv-product-icon">
                    <Package size={20} />
                  </div>
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
                  <span className="inv-quantity-received">
                    {product.stockReceived}
                  </span>
                </div>
                <div className="inv-mobile-card-item">
                  <label>STATUS</label>
                  <div>
                    <span
                      className={`inv-status ${getStatusClass(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="inv-mobile-card-item">
                  <label>RESERVED STOCK</label>
                  <span className="inv-quantity-reserved">
                    {product.reservedStock}
                  </span>
                </div>
                <div className="inv-mobile-card-item">
                  <label>TOTAL STOCK</label>
                  <span>{product.totalStock}</span>
                </div>
              </div>
              <div className="inv-mobile-card-actions">
                <button
                  className="inv-view-btn"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye size={13} /> View
                </button>
                <button
                  className="inv-manage-btn"
                  onClick={() => setManageProduct(product)}
                >
                  <Pencil size={13} /> Manage stock
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="inv-footer">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} products
          </p>
          <div className="inv-pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              ›
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="inventory-page">
      <div className="inventory-top">
        <div>
          <h2 className="inventory-title">Inventory Management</h2>
          <p className="inventory-sub">Manage your product inventory</p>
        </div>
        <div className="inventory-actions">
          <button
            className="inv-btn-outline"
            onClick={() => navigate("/inventory/categories")}
          >
            <Folder size={17} /> Categories
          </button>
          <button
            className="inv-btn-green"
            onClick={() => setShowRecordStock(true)}
          >
            <Truck size={17} /> Record Stock Entry
          </button>
          <button
            className="inv-btn-filled"
            onClick={() => setShowAddProduct(true)}
          >
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
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="inventory-stats">
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-blue">
            <Package size={22} />
          </div>
          <div>
            <p className="inv-stat-label">Total Products</p>
            <h3 className="inv-stat-value">{totalProducts}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-orange">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="inv-stat-label">Low stock Items</p>
            <h3 className="inv-stat-value">{lowStockItems}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-green">
            <Truck size={22} />
          </div>
          <div>
            <p className="inv-stat-label">Stock Entry</p>
            <h3 className="inv-stat-value">{stockEntry}</h3>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon inv-stat-red">
            <XCircle size={22} />
          </div>
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
              className={`inv-tab ${activeTab === tab ? "inv-tab-active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab === "All Products" && <Package size={16} />}
              {tab === "Stock Entry" && <ClipboardPlus size={16} />}
              {tab === "Low Stock" && <AlertTriangle size={16} />}
              {tab === "Stock History" && <Clock size={16} />}
              {tab === "Out of Stock" && <XCircle size={16} />}
              <span>{tab}</span>
              {tab === "Low Stock" && lowStockItems > 0 && (
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
              onChange={(e) => {
                setActiveTab(e.target.value);
                setCurrentPage(1);
              }}
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="inv-dropdown-icon-right" />
          </div>
        </div>

        {activeTab === "Stock Entry" ? (
          <div className="stock-entry-list">
            {stockEntries.length === 0
              ? renderEmptyState("No stock entries recorded yet.")
              : stockEntries.map((entry) => (
                  <div key={entry.id} className="stock-entry-card">
                    <div className="stock-entry-card-top">
                      <div className="stock-entry-card-left">
                        <div className="stock-entry-icon">
                          <Truck size={18} />
                        </div>
                        <div>
                          <p className="stock-entry-name">
                            {entry.productName}
                          </p>
                          <p className="stock-entry-meta">
                            Batch: {entry.batch} • Quantity: {entry.quantity}{" "}
                            units
                          </p>
                          <p className="stock-entry-meta">
                            Expiry: {entry.expiryDate}
                          </p>
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
                        <p>
                          {entry.timestamp.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p>
                          {entry.timestamp.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        ) : activeTab === "Stock History" ? (
          <div className="stock-entry-list">
            {stockHistory.length === 0
              ? renderEmptyState("No stock history recorded yet.")
              : stockHistory.map((item) => (
                  <div key={item.id} className="stock-entry-card">
                    <div className="stock-entry-card-top">
                      <div className="stock-entry-card-left">
                        <div
                          className={`stock-entry-icon ${item.type === "received" ? "stock-icon-green" : "stock-icon-purple"}`}
                        >
                          {item.type === "received" ? (
                            <Truck size={18} />
                          ) : (
                            <Clock size={18} />
                          )}
                        </div>
                        <div>
                          <p className="stock-entry-name">{item.productName}</p>
                          <p className="stock-entry-meta">
                            {item.action} • {item.units}
                          </p>
                          <p className="stock-history-note">{item.note}</p>
                          <div className="stock-entry-user">
                            <User size={13} />
                            <span>{item.user}</span>
                          </div>
                        </div>
                      </div>
                      <div className="stock-entry-time">
                        <p>
                          {item.timestamp.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p>
                          {item.timestamp.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        ) : activeTab === "Out of Stock" ? (
          <>{renderTable()}</>
        ) : (
          renderTable()
        )}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onManage={() => {
          setManageProduct(selectedProduct);
          setSelectedProduct(null);
        }}
      />

      {manageProduct && (
        <ManageStockModal
          inventoryId={manageProduct.inventoryId}
          product={manageProduct}
          onClose={() => setManageProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}

      <RecordStockModal
        onClose={() => setShowRecordStock(false)}
        visible={showRecordStock}
        onAddProduct={handleAddProduct}
      />
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onAddProduct={handleSaveNewProduct}
      />
      <ToastNotification
        message="Product added successfully"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Inventory;
