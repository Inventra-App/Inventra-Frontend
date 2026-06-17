import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Activity,
  ShoppingCart,
  TrendingDown,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  getTotalStockUnits,
  getTotalProductsCount,
  getTotalSalesAmount,
  getInventoryItems,
  getExpiryAlerts,
  getLowStockAlerts,
} from "../../API/inventoryApi";
import AlertModal from "../../Components/AlertModal";
import "./Css/Dashboard.css";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.alerts)) return payload.alerts;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
};

const formatAlertDate = (dateValue) => {
  if (!dateValue) return "No date";
  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysRemaining = (dateValue) => {
  if (!dateValue) return 0;
  const today = new Date();
  const expiryDate = new Date(dateValue);
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
};

const normalizeLowStockItem = (item) => {
  const product = item?.product ?? item?.productDetails ?? item;
  return {
    id: item?._id ?? item?.id ?? product?._id ?? product?.id ?? product?.productId,
    name: item?.productName ?? product?.productName ?? product?.name ?? "Unknown",
    category: item?.categoryName ?? product?.categoryName ?? product?.category ?? "-",
    units: Number(item?.availableStock ?? item?.quantity ?? item?.stock ?? product?.availableStock ?? product?.quantity ?? product?.stock ?? 0),
    batch: item?.batch ?? item?.batchNumber ?? item?.SKU ?? product?.SKU ?? "Batch no",
    expiryDate: formatAlertDate(item?.expiryDate ?? item?.expiresAt ?? item?.expires ?? product?.expiryDate),
  };
};

const normalizeExpiryAlert = (item) => {
  const product = item?.product ?? item?.productDetails ?? item;
  const expiryValue = item?.expiryDate ?? item?.expiresAt ?? item?.expires ?? item?.expirationDate ?? product?.expiryDate;
  const daysRemaining = Number(item?.daysRemaining ?? item?.daysLeftNumber ?? getDaysRemaining(expiryValue));
  const expiredDays = Math.abs(daysRemaining);

  return {
    id: item?._id ?? item?.id ?? product?._id ?? product?.id ?? `${product?.productName}-${expiryValue}`,
    name: item?.productName ?? product?.productName ?? product?.name ?? "Unnamed Product",
    batch: item?.batch ?? item?.batchNumber ?? item?.SKU ?? product?.SKU ?? "N/A",
    quantity: Number(item?.quantity ?? item?.availableStock ?? product?.quantity ?? product?.availableStock ?? 0),
    category: item?.categoryName ?? product?.categoryName ?? product?.category ?? "General",
    expiryDate: formatAlertDate(expiryValue),
    daysRemaining,
    daysLeft: daysRemaining <= 0
      ? `${expiredDays} day${expiredDays === 1 ? "" : "s"} ago`
      : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`,
    status: daysRemaining <= 0 ? "EXPIRED" : "EXPIRING SOON",
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalStockUnits, setTotalStockUnits] = useState(null);
  const [totalSalesAmount, setTotalSalesAmount] = useState(null);
  const [expiryItems, setExpiryItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "expired", "expiring", "lowstock"
  const [modalItems, setModalItems] = useState([]);
  const [modalQueue, setModalQueue] = useState([]); // Queue of modals to show

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getTotalStockUnits().catch(() => null),
        getTotalProductsCount().catch(() => null),
        getTotalSalesAmount().catch(() => null),
        getInventoryItems().catch(() => []),
        getExpiryAlerts().catch(() => []),
        getLowStockAlerts().catch(() => []),
      ]);

      const [tsuRes, tpcRes, tsaRes, invRes, expiryRes, lowStockRes] = results;

      // Total Stock Units
      const tsu =
        tsuRes.status === "fulfilled" && tsuRes.value
          ? typeof tsuRes.value === "number"
            ? tsuRes.value
            : (tsuRes.value?.totalStockUnits ??
              tsuRes.value?.data ??
              tsuRes.value?.count ??
              null)
          : null;
      setTotalStockUnits(tsu);

      // Total Products Count
      const tpc =
        tpcRes.status === "fulfilled" && tpcRes.value
          ? typeof tpcRes.value === "number"
            ? tpcRes.value
            : (tpcRes.value?.totalProducts ??
              tpcRes.value?.data ??
              tpcRes.value?.count ??
              null)
          : null;
      setTotalProducts(tpc);

      // Total Sales Amount
      const tsa =
        tsaRes.status === "fulfilled" && tsaRes.value
          ? typeof tsaRes.value === "number"
            ? tsaRes.value
            : (tsaRes.value?.totalSalesAmount ??
              tsaRes.value?.data ??
              tsaRes.value?.amount ??
              null)
          : null;
      setTotalSalesAmount(tsa);

      // Low Stock — use API data or derive from inventory items
      let lowStock = [];
      if (lowStockRes.status === "fulfilled" && lowStockRes.value) {
        const apiLowStock = getArrayPayload(lowStockRes.value);

        if (apiLowStock.length > 0) {
          lowStock = apiLowStock.map(normalizeLowStockItem);
        }
      }

      // Fallback: derive from inventory items if API doesn't return data
      if (lowStock.length === 0) {
        const items = invRes.status === "fulfilled" ? getArrayPayload(invRes.value) : [];

        lowStock = items
          .filter((p) => {
            const qty = p.availableStock ?? p.quantity ?? p.stock ?? 0;
            return qty > 0 && qty <= 10;
          })
          .map(normalizeLowStockItem);
      }
      setLowStockItems(lowStock);

      // Expiry Alerts
      const expiry = expiryRes.status === "fulfilled" ? getArrayPayload(expiryRes.value) : [];
      const normalizedExpiry = expiry.map(normalizeExpiryAlert);
      setExpiryItems(normalizedExpiry);

      // Separate expired and expiring items for modals
      const expiredItems = normalizedExpiry.filter(
        (item) => item.status === "EXPIRED",
      );
      const expiringItems = normalizedExpiry.filter(
        (item) => item.daysRemaining >= 1 && item.daysRemaining <= 7,
      );

      // Create modal queue
      const queue = [];
      if (expiredItems.length > 0) {
        queue.push({
          type: "expired",
          items: expiredItems,
        });
      }
      if (expiringItems.length > 0) {
        queue.push({
          type: "expiring",
          items: expiringItems,
        });
      }
      if (lowStock.length > 0) {
        queue.push({
          type: "lowstock",
          items: lowStock,
        });
      }

      setModalQueue(queue);

      // Show first modal in queue
      if (queue.length > 0) {
        const firstModal = queue[0];
        setModalType(firstModal.type);
        setModalItems(firstModal.items);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(fetchData, 0);
    return () => window.clearTimeout(timerId);
  }, [fetchData]);

  // Modal handlers
  const handleDismissModal = () => {
    setShowModal(false);
    // Show next modal in queue after a short delay
    setTimeout(() => {
      const currentIndex = modalQueue.findIndex((m) => m.type === modalType);
      if (currentIndex !== -1 && currentIndex + 1 < modalQueue.length) {
        const nextModal = modalQueue[currentIndex + 1];
        setModalType(nextModal.type);
        setModalItems(nextModal.items);
        setShowModal(true);
      }
    }, 300);
  };

  const handleViewDetails = () => {
    setShowModal(false);
    if (modalType === "expired" || modalType === "expiring") {
      navigate("/expiry");
    } else if (modalType === "lowstock") {
      navigate("/inventory");
    }
  };

  const handleRestock = (item) => {
    console.log("Restock item:", item);
    setShowModal(false);
    navigate("/inventory");
  };

  const criticalAlerts = expiryItems.filter(
    (item) => item.status === "EXPIRED",
  ).length;

  const statCards = [
    {
      label: "Total Products",
      value: totalProducts !== null ? String(totalProducts) : "0",
      icon: <Package size={22} />,
      color: "blue",
    },
    {
      label: "Total Stock Units",
      value: totalStockUnits !== null ? String(totalStockUnits) : "0",
      icon: <Activity size={22} />,
      color: "green",
    },
    {
      label: "Sales Today",
      value:
        totalSalesAmount !== null
          ? `₦${Number(totalSalesAmount).toLocaleString()}`
          : "₦0",
      icon: <ShoppingCart size={22} />,
      color: "purple",
    },
    {
      label: "Critical Alerts",
      value: String(criticalAlerts),
      sub: "Products expiring soon",
      icon: <TrendingDown size={22} />,
      color: "red",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Loading dashboard...</h2>
          <p>Fetching your latest inventory data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button
            className="inv-btn-filled"
            onClick={fetchData}
            style={{ marginTop: 16 }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Welcome back!</h2>
        <p>Here's what's happening in your supermarket today.</p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-left">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{card.value}</h3>
              {card.sub && <p className="stat-sub">{card.sub}</p>}
            </div>
            <div className={`stat-icon stat-icon-${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-alerts">
        <div className="alert-card">
          <div className="alert-card-header">
            <div className="alert-card-title">
              <AlertTriangle size={18} className="alert-icon-orange" />
              <h4>Expiry Alerts</h4>
            </div>
            <span className="alert-badge alert-badge-orange">
              {expiryItems.length}
            </span>
          </div>
          <div className="alert-list">
            {expiryItems.length === 0 ? (
              <p className="expiry-meta dashboard-empty-alert">
                No expiry alerts to display.
              </p>
            ) : (
              expiryItems.map((item) => (
                <div
                  key={item.id}
                  className={`dashboard-expiry-item dashboard-expiry-${
                    item.daysRemaining <= 0 ? "expired" : "expiring"
                  }`}
                >
                  <div className="dashboard-expiry-content">
                    <p className="dashboard-expiry-name">{item.name}</p>
                    <p className="dashboard-expiry-details">
                      Batch: {item.batch} • Qty: {item.quantity} • Expires:{" "}
                      {item.expiryDate}
                    </p>
                  </div>
                  <div className="dashboard-expiry-badge">
                    <span
                      className={`dashboard-days-badge dashboard-days-${
                        item.daysRemaining <= 0 ? "red" : "orange"
                      }`}
                    >
                      {item.daysLeft}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="alert-card">
          <div className="alert-card-header">
            <div className="alert-card-title">
              <TrendingDown size={18} className="alert-icon-red" />
              <h4>Low Stock Alerts</h4>
            </div>
            <span className="alert-badge alert-badge-red">
              {lowStockItems.length}
            </span>
          </div>
          <div className="alert-list">
            {lowStockItems.length === 0 ? (
              <p
                className="expiry-meta"
                style={{ padding: "12px 0", textAlign: "center" }}
              >
                All products are well-stocked.
              </p>
            ) : (
              lowStockItems.map((item, index) => (
                <div key={index} className="lowstock-item">
                  <div>
                    <p className="expiry-name">{item.name}</p>
                    <p className="expiry-meta">Category: {item.category}</p>
                  </div>
                  <div className="lowstock-units">
                    <span className="lowstock-count">{item.units}</span>
                    <span className="lowstock-label">units left</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activity-card">
        <div className="alert-card-header">
          <div className="alert-card-title">
            <Calendar size={18} className="alert-icon-blue" />
            <h4>Recent Activities</h4>
          </div>
        </div>
        <div className="activity-list">
          <div
            className="activity-item"
            style={{ justifyContent: "center", padding: "24px 0" }}
          >
            <p className="expiry-meta">No recent activities to display.</p>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showModal}
        type={modalType}
        items={modalItems}
        onDismiss={handleDismissModal}
        onViewDetails={handleViewDetails}
        onRestock={handleRestock}
      />
    </div>
  );
};

export default Dashboard;
