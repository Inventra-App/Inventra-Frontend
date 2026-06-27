import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Package,
  ClipboardPlus,
  AlertTriangle,
  XCircle,
  Eye,
  Pencil,
  Truck,
  Contact,
  User,
  Building,
  ChevronDown,
  Clock,
  Folder,
  PackagePlus,
  ArrowRightLeft,
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
import { useNavigate, useLocation } from "react-router-dom";
import InventoryStats from "../../InventoryComponents/ModalComponents/InventoryStats";
import InventoryTabs from "../../InventoryComponents/ModalComponents/InventoryTabs";
import InventoryTable from "../../InventoryComponents/ModalComponents/InventoryTable";
import SearchBar from "../../InventoryComponents/ModalComponents/SearchBar";
import AddCategoryModal from "../../CategoryComponents/catComponents/AddCategoryModal";
import { addCategory } from "../../API/inventoryApi";
import NewUserGuide from "../../Components/NewUserGuide";
import {
  markInventoryGuideSeen,
  shouldShowInventoryGuide,
} from "../../Utils/sessionUser";

const ITEMS_PER_PAGE = 6;
const tabs = [
  "All Products",
  "Stock Entry",
  "Low Stock",
  // "Stock History",
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

const normalizeLowStockItem = (item, products = []) => {
  const availableStock = Number(item?.availableStock ?? 0);
  const totalStock = Number(item?.totalStock ?? 0);
  const reservedStock = Number(item?.reservedStock ?? 0);

  const matchedProduct = products[item?.productId];

  return {
    id: item?.productId || item?.id || item?.product,
    name: item?.product || item?.productName || "Unnamed Product",

    category: item?.categoryName || matchedProduct?.category || "Uncategorized",

    backroomStock: item?.backroomStock ?? matchedProduct?.backroomStock ?? 0,

    availableStock,
    totalStock,
    reservedStock,

    stockReceived: 0,

    status: "Low Stock",
  };
};

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [lowStockAlertItems, setLowStockAlertItems] = useState([]);
  const [productLookup, setProductLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [stockEntries, setStockEntries] = useState([]);

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("inventra_user")) || {};
    } catch {
      return {};
    }
  };

  const currentUser = getCurrentUser();

  const userName =
    currentUser?.fullName || currentUser?.firstName || "Unknown User";

  const [stockHistory, setStockHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manageProduct, setManageProduct] = useState(null);
  const [showRecordStock, setShowRecordStock] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeMenuProduct, setActiveMenuProduct] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [hasCreatedCategory, setHasCreatedCategory] = useState(
    localStorage.getItem("hasCreatedCategory") === "true",
  );

  const [showNewUserGuide, setShowNewUserGuide] = useState(() => {
    const dismissed =
      localStorage.getItem("inventoryGuideDismissed") === "true";

    return shouldShowInventoryGuide() && !dismissed;
  });

  const [openProductAfterCategory, setOpenProductAfterCategory] =
    useState(false);

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [productsRes, inventoryRes] = await Promise.all([
        getAllProducts({ _t: Date.now() }),
        getInventoryItems({ _t: Date.now() }),
      ]);

      const products = Array.isArray(productsRes)
        ? productsRes
        : productsRes?.data || [];

      const productLookup = Object.fromEntries(
        products.map((p) => [
          p._id,
          {
            category: p.categoryName || "Uncategorized",
            productName: p.productName,
          },
        ]),
      );

      const inventory = Array.isArray(inventoryRes)
        ? inventoryRes
        : inventoryRes?.data || [];

      const stored = JSON.parse(localStorage.getItem("stockReceived") || "{}");

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
          isExpiring: prod.isExpiring,
          category: prod.categoryName || "Uncategorized",
          packageType: prod.packageType,
          packageQuantity: prod.packageQuantity,
          unitPerPackage: prod.unitPerPackage,
          batch: prod.SKU || "N/A",
          price: Number(prod.unitPrice || 0),
          createdAt: prod.createdAt,
          availableStock: Number(inv.availableStock) || 0,
          totalStock: total,
          backroomStock: Number(inv.backroomStock) || 0,
          writeOffStock: Number(inv.writeOffStock) || 0,
          stockReceived: stored[prod._id] || 0,
          status,
        };
      });
      mapped.reverse();
      setProductLookup(productLookup);
      setProductList(mapped);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchLowStockAlerts = useCallback(async () => {
    try {
      const response = await getLowStockAlerts();

      const normalized = getArrayPayload(response).map((item) =>
        normalizeLowStockItem(item, productLookup),
      );

      setLowStockAlertItems(normalized);
    } catch (err) {
      console.error("Low stock alerts fetch error:", err);
      setLowStockAlertItems([]);
    }
  }, [productLookup]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("restockProductId");

    if (!productId || productList.length === 0) return;

    const product = productList.find(
      (p) => p._id === productId || p.id === productId,
    );

    if (product) {
      setShowRecordStock(product);

      navigate("/super/inventory", {
        replace: true,
      });
    }
  }, [location.search, productList, navigate]);

  useEffect(() => {
    if (Object.keys(productLookup).length > 0) {
      fetchLowStockAlerts();
    }
  }, [productLookup, fetchLowStockAlerts]);

  const handleSaveNewProduct = async () => {
    await fetchProducts(true);
    await fetchLowStockAlerts();

    setShowToast(true);
  };

  const handleSaveCategory = async (newCat) => {
    try {
      await addCategory({
        categoryName: newCat.name,
        description: newCat.description,
      });

      setHasCreatedCategory(true);
      localStorage.setItem("hasCreatedCategory", "true");

      setShowAddCategory(false);

      if (openProductAfterCategory) {
        setShowAddProduct(true);
        setOpenProductAfterCategory(false);
      }
    } catch (error) {
      console.error("Error saving category:", error?.response?.data);
      throw error;
    }
  };

  const closeNewUserGuide = () => {
    localStorage.setItem("inventoryGuideDismissed", "true");
    setShowNewUserGuide(false);
  };

  const openCreateCategory = () => {
    setOpenProductAfterCategory(true);
    setShowAddProduct(false);
    setShowAddCategory(true);
  };

  const openAddProduct = () => {
    setShowAddCategory(false);
    setShowAddProduct(true);
  };

  const getTabFiltered = useCallback(() => {
    if (activeTab === "Low Stock") {
      return productList.filter((p) => p.status === "Low Stock");
    }
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
  const lowStockItems = productList.filter(
    (p) => p.status === "Low Stock",
  ).length;

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

  const handleAddProduct = (data) => {
    if (!data) return;

    const newBatch = data?.batch;
    const inventory = data?.inventory;

    if (!newBatch || !inventory) return;

    const productName =
      productList.find((p) => p._id === newBatch.productId)?.name || "Unknown";

    const newEntry = {
      id: newBatch._id || Date.now(),
      productName,
      batch: newBatch.batchCode,
      quantity: newBatch.quantity,
      expiryDate: new Date(newBatch.expiryDate).toLocaleDateString("en-GB"),
      user: {
        id: currentUser?.id || currentUser?._id || "unknown",
        name: userName,
        role: currentUser?.role || "staff",
      },
      supplier: data?.batch?.supplier || "N/A",
      timestamp: new Date().toISOString(),
    };

    setStockEntries((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem("stockEntries", JSON.stringify(updated));
      return updated;
    });

    setProductList((prev) =>
      prev.map((p) =>
        p._id === newBatch.productId
          ? {
              ...p,
              inventoryId: inventory._id,
              availableStock: inventory.availableStock ?? 0,
              backroomStock: inventory.backroomStock ?? 0,
              totalStock:
                (inventory.availableStock ?? 0) +
                (inventory.backroomStock ?? 0),
            }
          : p,
      ),
    );

    setTimeout(() => {
      fetchProducts(true);
      fetchLowStockAlerts();
    }, 1000);
  };

  useEffect(() => {
    const storedEntries = JSON.parse(
      localStorage.getItem("stockEntries") || "[]",
    );

    setStockEntries(
      storedEntries.map((e) => ({
        ...e,
        timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
      })),
    );
  }, []);

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

  return (
    <div className="inventory-page">
      {showNewUserGuide && (
        <NewUserGuide
          onClose={closeNewUserGuide}
          onCreateCategory={openCreateCategory}
          onAddProduct={openAddProduct}
          hasCategories={hasCreatedCategory}
        />
      )}

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
            className="inv-btn-filled"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus size={17} /> Add Product
          </button>
        </div>
      </div>

      <SearchBar
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <InventoryStats
        stats={{
          total: totalProducts,
          lowStock: lowStockItems,
          entries: stockEntry,
          outOfStock,
        }}
      />

      <div className="inventory-table-wrapper">
        <InventoryTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockItems}
        />

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
                    <div className="stock-entry-card-left">
                      <div className="stock-entry-icon">
                        <Truck size={20} />
                      </div>

                      <div className="stock-entry-content">
                        <p className="stock-entry-name">{entry.productName}</p>

                        <p className="stock-entry-batch">
                          Batch: {entry.batch || "N/A"} • Qty: {entry.quantity}{" "}
                          units
                        </p>

                        <div className="stock-entry-details">
                          <div className="stock-entry-detail-item">
                            <User size={14} />

                            <span className="detail-value">
                              {entry.user?.name || "Unknown"}
                            </span>

                            {entry.user?.role && (
                              <span className="role-tag">
                                {entry.user.role}
                              </span>
                            )}
                          </div>
                          <div className="stock-entry-detail-item">
                            <User size={14} />
                            <span>
                              Supplier:{" "}
                              <span className="detail-value">
                                {entry.supplier || "N/A"}
                              </span>
                            </span>
                          </div>
                        </div>

                        <p className="stock-entry-expiry">
                          Expiry: {entry.expiryDate}
                        </p>
                      </div>
                    </div>

                    <div className="stock-entry-time">
                      <p>{new Date(entry.timestamp).toLocaleDateString()}</p>
                      <p>
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        ) : activeTab === "Stock History" ? (
          <div className="stock-entry-list">
            {stockHistory.length === 0
              ? renderEmptyState("No stock history recorded yet.")
              : stockHistory.map((item) => (
                  <div key={item.id} className="stock-entry-card" />
                ))}
          </div>
        ) : loading ? (
          <div className="inv-loading">Loading products...</div>
        ) : filtered.length === 0 ? (
          renderEmptyState(
            search
              ? `No products found for "${search}"`
              : "No products available yet.",
          )
        ) : (
          <>
            <div className="inventory-table-inner">
              <InventoryTable
                data={paginated}
                onView={setSelectedProduct}
                onManage={setManageProduct}
                getStatusClass={getStatusClass}
                activeMenuProduct={activeMenuProduct}
                setActiveMenuProduct={setActiveMenuProduct}
                setShowRecordStock={setShowRecordStock}
                setManageProduct={setManageProduct}
              />
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </>
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
        onClose={() => setShowRecordStock(null)}
        visible={!!showRecordStock}
        product={
          showRecordStock
            ? {
                ...showRecordStock,
                hasExpiry: !!showRecordStock.expiryDate,
              }
            : null
        }
        onAddProduct={handleAddProduct}
      />

      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onAddProduct={handleSaveNewProduct}
        onCreateCategory={() => {
          setShowAddProduct(false);
          setOpenProductAfterCategory(true);
          setShowAddCategory(true);
        }}
      />

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          if (openProductAfterCategory) {
            setShowAddProduct(true);
            setOpenProductAfterCategory(false);
          }
        }}
        onSave={handleSaveCategory}
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
