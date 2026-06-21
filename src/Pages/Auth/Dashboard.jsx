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
  getActivityLogs,
} from "../../API/inventoryApi";
import AlertModal from "../../Components/AlertModal";
import {
  getSessionUser,
  isNewSessionUser,
  markReturningSessionUser,
} from "../../Utils/sessionUser";
import "./Css/Dashboard.css";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.alerts)) return payload.alerts;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
};

const getModuleType = (module = "") => {
  const m = module.toUpperCase();
  if (m.includes("SALE") || m.includes("POS")) return "sale";
  if (m.includes("STOCK") || m.includes("BATCH") || m.includes("RECEIV"))
    return "receiving";
  return "inventory";
};

const formatActivityDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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
  return {
    id: item?._id ?? item?.productId,
    name: item?.productName ?? "Unknown",
    category: item?.categoryName ?? "-",
    units: Number(
      item?.totalStock ?? item?.availableStock ?? item?.quantity ?? 0,
    ),
    batch: item?.SKU ?? item?.batchCode ?? "Batch no",
    expiryDate: "No date",
  };
};

const normalizeExpiryAlert = (item) => {
  const expiryValue =
    item?.expiryDate ??
    item?.expiresAt ??
    item?.expires ??
    item?.expirationDate;
  const daysRemaining = Number(
    item?.daysLeft ?? item?.daysRemaining ?? getDaysRemaining(expiryValue),
  );
  const expiredDays = Math.abs(daysRemaining);

  return {
    id: item?._id ?? item?.productId ?? `${item?.productName}-${expiryValue}`,
    name: item?.productName ?? "Unnamed Product",
    batch: item?.batchCode ?? item?.batch ?? "N/A",
    quantity: Number(
      item?.quantityRemaining ?? item?.inventory?.totalStock ?? 0,
    ),
    category: item?.categoryName ?? "General",
    expiryDate: formatAlertDate(expiryValue),
    daysRemaining,
    daysLeft:
      daysRemaining <= 0
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

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalItems, setModalItems] = useState([]);
  const [modalQueue, setModalQueue] = useState([]);
  const [sessionUser] = useState(() => getSessionUser());
  const [isFirstLogin] = useState(() => isNewSessionUser());
  const [recentActivities, setRecentActivities] = useState([]);

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
        getActivityLogs().catch(() => null),
      ]);

      const [
        tsuRes,
        tpcRes,
        tsaRes,
        invRes,
        expiryRes,
        lowStockRes,
        activityRes,
      ] = results;

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

      let lowStock = [];
      if (lowStockRes.status === "fulfilled" && lowStockRes.value) {
        const apiLowStock = getArrayPayload(lowStockRes.value);

        if (apiLowStock.length > 0) {
          lowStock = apiLowStock.map(normalizeLowStockItem);
        }
      }

      if (lowStock.length === 0) {
        const items =
          invRes.status === "fulfilled" ? getArrayPayload(invRes.value) : [];

        lowStock = items
          .filter((p) => {
            const qty = p.availableStock ?? p.quantity ?? p.stock ?? 0;
            return qty > 0 && qty <= 10;
          })
          .map(normalizeLowStockItem);
      }
      setLowStockItems(lowStock);

      if (activityRes.status === "fulfilled" && activityRes.value) {
        const list = Array.isArray(activityRes.value?.data)
          ? activityRes.value.data
          : [];
        const normalized = [...list]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((item) => ({
          id: item._id,
          type: getModuleType(item.module),
          label: item.action || item.title || "Activity",
          desc: item.description || "-",
          user: item.user || "System",
          date: formatActivityDate(item.createdAt),
          amount:
            item.amount > 0
              ? `+₦${Number(item.amount).toLocaleString()}`
              : null,
        }));
        setRecentActivities(normalized);
      }

      const expiry =
        expiryRes.status === "fulfilled"
          ? getArrayPayload(expiryRes.value)
          : [];
      const normalizedExpiry = expiry.map(normalizeExpiryAlert);
      setExpiryItems(normalizedExpiry);

      const expiredItems = normalizedExpiry.filter(
        (item) => item.status === "EXPIRED",
      );
      const expiringItems = normalizedExpiry.filter(
        (item) => item.daysRemaining >= 1 && item.daysRemaining <= 7,
      );

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

  useEffect(() => {
    if (!isFirstLogin) return;
    markReturningSessionUser();
  }, [isFirstLogin]);

  const handleDismissModal = () => {
    setShowModal(false);

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
      value: totalSalesAmount !== null ? `${Number(totalSalesAmount).toLocaleString()}` : "0",
      sub:  totalSalesAmount === 0 || totalSalesAmount === null
            ? "no transactions yet"
            : `transaction${Number(totalSalesAmount) === 1 ? "" : "s"} completed`,
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
        <h2>
          {isFirstLogin
            ? `Welcome to INVENTRA ${sessionUser.businessName}`
            : `Welcome back, ${sessionUser.businessName}!!`}
        </h2>
        <p>
          Here's what's happening in your supermarket today.{" "}
          <span className="expiry-admin">({sessionUser.role})</span>
        </p>
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
              expiryItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
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

      <div className="activity-card">
        <div className="alert-card-header">
          <div className="alert-card-title">
            <Calendar size={18} className="alert-icon-blue" />
            <h4>Recent Activities</h4>
          </div>
          <span className="alert-badge alert-badge-blue">
            {recentActivities.length}
          </span>
        </div>
        <div className="activity-list">
          {recentActivities.length === 0 ? (
            <div
              className="activity-item"
              style={{ justifyContent: "center", padding: "24px 0" }}
            >
              <p className="expiry-meta">No recent activities to display.</p>
            </div>
          ) : (
            recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div
                  className={`activity-icon ${
                    act.type === "sale"
                      ? 'activity-icon-sale'
                      : act.type === "receiving"
                        ? 'activity-icon-receive'
                        : 'activity-icon-create'
                  }`}
                >
                  {act.type === "sale" ? (
                    <ShoppingCart size={18} />
                  ) : act.type === "receiving" ? (
                    <TrendingDown size={18} />
                  ) : (
                    <Package size={18} />
                  )}
                </div>
                <div className="activity-details">
                  <div className="activity-top">
                    <span className="activity-label">{act.label}</span>
                    <span style={{ flex: 1 }} />
                    <span
                      className={`activity-tag ${
                        act.type === "sale"
                          ? "activity-tag-green"
                          : act.type === "receiving"
                            ? "activity-tag-purple"
                            : "activity-tag-blue"
                      }`}
                    >
                      {act.type === "sale"
                        ? "Sale"
                        : act.type === "receiving"
                          ? "Receiving"
                          : "Inventory"}
                    </span>
                  </div>
                  <p className="activity-desc">{act.desc}</p>
                  <p className="activity-meta">{act.date}</p>
                </div>
                {act.amount && (
                  <div className="activity-amount">{act.amount}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

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
