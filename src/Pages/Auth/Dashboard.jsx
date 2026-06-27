import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  getInventoryItems,
  getExpiryAlerts,
  getLowStockAlerts,
  getActivityLogs,
  getAllProducts,
} from "../../API/inventoryApi";
import { getDailySalesTotal } from "../../API/salesPosApi";
import AlertModal from "../../Components/AlertModal";
import {
  getSessionUser,
  isNewSessionUser,
  markReturningSessionUser,
} from "../../Utils/sessionUser";
import { normalizeRole } from "../../Utils/authRoles";
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

const getValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const getProductId = (item) =>
  String(
    getValue(
      item?.productId?._id,
      item?.productId,
      item?.product?._id,
      item?.inventory?.productId?._id,
      item?.inventory?.productId,
      "",
    ),
  );

const getProductName = (item) =>
  getValue(
    item?.productName,
    item?.name,
    item?.product?.productName,
    item?.product?.name,
    item?.inventory?.productName,
    item?.inventory?.product?.productName,
    "",
  );

const findMatchingProduct = (item, products) => {
  const productId = getProductId(item);
  const productName = String(getProductName(item)).toLowerCase();

  return products.find((product) => {
    const currentId = String(
      product?._id ?? product?.id ?? product?.productId ?? "",
    );
    const currentName = String(
      product?.productName ?? product?.name ?? "",
    ).toLowerCase();

    return (
      (productId && currentId === productId) ||
      (productName && currentName === productName)
    );
  });
};

const getInventoryUnits = (item) =>
  Number(
    getValue(
      item?.inventory?.totalStock,
      item?.totalInventory,
      item?.totalInventoryStock,
      item?.totalStock,
      item?.availableStock,
      item?.quantity,
      item?.stock,
      0,
    ),
  );

const buildInventoryLookup = (inventoryItems = []) => {
  const lookup = new Map();

  inventoryItems.forEach((item) => {
    const id = getProductId(item);
    const name = String(getProductName(item)).toLowerCase();
    const record = {
      units: getInventoryUnits(item),
      category: getCategoryName(item),
      productId: id,
    };

    if (id) lookup.set(`id:${id}`, record);
    if (name) lookup.set(`name:${name}`, record);
  });

  return lookup;
};

const findInventoryRecord = (item, inventoryLookup) => {
  const id = getProductId(item);
  const name = String(getProductName(item)).toLowerCase();
  return (
    (id && inventoryLookup.get(`id:${id}`)) ||
    (name && inventoryLookup.get(`name:${name}`)) ||
    null
  );
};

const normalizeLowStockAlert = (item, productLookup = {}) => {
  const availableStock = Number(item?.availableStock ?? 0);
  const totalStock = Number(item?.totalStock ?? 0);
  const reservedStock = Number(item?.reservedStock ?? 0);

  const matchedProduct = productLookup[item?.productId];

  return {
    id: item?.productId || item?.id || item?.product,
    productId: item?.productId,
    name: item?.product || item?.productName || "Unnamed Product",
    category: item?.categoryName || matchedProduct?.category || "Uncategorized",
    availableStock,
    totalStock,
    reservedStock,
    backroomStock: item?.backroomStock ?? matchedProduct?.backroomStock ?? 0,
    stockReceived: 0,
    status: "Low Stock",
  };
};

const getCategoryName = (item, matchedProduct) =>
  getValue(
    item?.categoryName,
    item?.category?.categoryName,
    item?.category?.name,
    item?.product?.categoryName,
    item?.product?.category?.categoryName,
    item?.product?.category?.name,
    matchedProduct?.categoryName,
    matchedProduct?.category?.categoryName,
    matchedProduct?.category?.name,
    "Uncategorized",
  );

const normalizeExpiryAlert = (
  item,
  products = [],
  inventoryLookup = new Map(),
) => {
  const matchedProduct = findMatchingProduct(item, products);
  const inventoryRecord = findInventoryRecord(item, inventoryLookup);
  const productId = getProductId(item) || matchedProduct?._id || item?._id;
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
    id: `${productId}-${item?.batchCode ?? item?.batch ?? "NA"}`,
    productId,
    name: getValue(
      getProductName(item),
      matchedProduct?.productName,
      matchedProduct?.name,
      "Unnamed Product",
    ),
    batch: item?.batchCode ?? item?.batch ?? "N/A",
    quantity: Number(
      getValue(
        inventoryRecord?.units,
        item?.quantityRemaining,
        item?.inventory?.totalStock,
        item?.totalStock,
        item?.quantity,
        0,
      ),
    ),
    category:
      inventoryRecord?.category || getCategoryName(item, matchedProduct),
    expiryDate: formatAlertDate(expiryValue),
    daysRemaining,
    urgency: item?.urgencyLevel,
    daysLeft:
      daysRemaining <= 0
        ? `${expiredDays} day${expiredDays === 1 ? "" : "s"} ago`
        : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`,
  };
};

const dashboardCache = {
  data: null,
  timestamp: null,
};
const CACHE_TTL = 2 * 60 * 1000;

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(
    dashboardCache.data?.totalProducts ?? null,
  );
  const [totalStockUnits, setTotalStockUnits] = useState(
    dashboardCache.data?.totalStockUnits ?? null,
  );
  const [totalSalesAmount, setTotalSalesAmount] = useState(
    dashboardCache.data?.totalSalesAmount ?? null,
  );
  const [expiryItems, setExpiryItems] = useState(
    dashboardCache.data?.expiryItems ?? [],
  );
  const [lowStockItems, setLowStockItems] = useState(
    dashboardCache.data?.lowStockItems ?? [],
  );
  const [recentActivities, setRecentActivities] = useState(
    dashboardCache.data?.recentActivities ?? [],
  );
  const [loading, setLoading] = useState(!dashboardCache.data);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalItems, setModalItems] = useState([]);
  const [modalQueue, setModalQueue] = useState([]);
  const reduxUser = useSelector((state) => state.apiInfo?.user);
  const sessionUser = reduxUser ?? getSessionUser();
  const currentRole = normalizeRole(sessionUser.role) || "Admin";
  const isAdmin = currentRole === "Admin";
  const isManager = currentRole === "Manager";
  const [isFirstLogin] = useState(() => isNewSessionUser());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getTotalStockUnits().catch(() => null),
        getTotalProductsCount().catch(() => null),
        getDailySalesTotal().catch(() => null),
        getInventoryItems().catch(() => []),
        getExpiryAlerts().catch(() => []),
        getLowStockAlerts().catch(() => []),
        getActivityLogs().catch(() => null),
        getAllProducts().catch(() => []),
      ]);

      const [
        tsuRes,
        tpcRes,
        tsaRes,
        invRes,
        expiryRes,
        lowStockRes,
        activityRes,
        productsRes,
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

      const dailySales =
        tsaRes.status === "fulfilled"
          ? (tsaRes.value?.data?.[0] ?? null)
          : null;

      const tsa = Number(dailySales?.totalSales ?? 0);

      setTotalSalesAmount(tsa);

      const inventoryItems =
        invRes.status === "fulfilled" ? getArrayPayload(invRes.value) : [];

      const products =
        productsRes.status === "fulfilled"
          ? getArrayPayload(productsRes.value)
          : [];

      const productLookup = Object.fromEntries(
        products.map((p) => [
          p._id,
          {
            category: p.categoryName || "Uncategorized",
            productName: p.productName,
            reorderLevel: Number(p.reorderLevel || 10),
            backroomStock: 0,
          },
        ]),
      );

      const inventoryLookup = buildInventoryLookup(inventoryItems);

      const mappedProducts = products.map((prod) => {
        const inv = inventoryItems.find((i) => i.productId === prod._id) || {};

        const total = Number(inv.totalStock) || 0;
        const reorderLevel = Number(prod.reorderLevel) || 10;

        const status =
          total > reorderLevel
            ? "In Stock"
            : total > 0
              ? "Low Stock"
              : "Out of Stock";

        return {
          id: prod._id,
          productId: prod._id,
          name: prod.productName || "Unnamed Product",
          category: prod.categoryName || "Uncategorized",
          totalStock: total,
          availableStock: Number(inv.availableStock) || 0,
          backroomStock: Number(inv.backroomStock) || 0,
          reservedStock: Number(inv.reservedStock) || 0,
          status,
        };
      });

      const lowStock = mappedProducts.filter((p) => p.status === "Low Stock");

      setLowStockItems(lowStock);

      let normalized = [];
      if (activityRes.status === "fulfilled" && activityRes.value) {
        const list = Array.isArray(activityRes.value?.data)
          ? activityRes.value.data
          : [];
        normalized = [...list]
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

      const normalizedExpiry = expiry.map((item) =>
        normalizeExpiryAlert(item, products, inventoryLookup),
      );
      setExpiryItems(normalizedExpiry);

      const expiredItems = normalizedExpiry.filter(
        (item) => item.daysRemaining <= 3,
      );

      const expiringItems = normalizedExpiry.filter(
        (item) => item.daysRemaining >= 4 && item.daysRemaining <= 7,
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

      dashboardCache.data = {
        totalProducts: tpc,
        totalStockUnits: tsu,
        totalSalesAmount: tsa,
        expiryItems: normalizedExpiry,
        lowStockItems: lowStock,
        recentActivities: normalized,
      };
      dashboardCache.timestamp = Date.now();
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isCacheFresh =
      dashboardCache.timestamp &&
      Date.now() - dashboardCache.timestamp < CACHE_TTL;

    if (isCacheFresh) return;

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
    setShowModal(false);
    navigate(`/super/inventory?restockProductId=${item.productId || item.id}`);
  };

  const expiredAlerts = expiryItems.filter(
    (item) => item.status === "EXPIRED",
  ).length;
  const criticalAlerts = expiredAlerts + lowStockItems.length;

  const statCards = [
    {
      roles: ["Admin", "Manager"],
      label: "Total Products",
      value: totalProducts !== null ? String(totalProducts) : "0",
      icon: <Package size={22} />,
      color: "blue",
    },
    {
      roles: ["Admin", "Manager"],
      label: "Total Stock Units",
      value: totalStockUnits !== null ? String(totalStockUnits) : "0",
      icon: <Activity size={22} />,
      color: "green",
    },
    {
      roles: ["Admin", "Cashier"],
      label: "Sales Today",
      value:
        totalSalesAmount !== null
          ? `${Number(totalSalesAmount).toLocaleString()}`
          : "0",
      sub:
        totalSalesAmount === 0 || totalSalesAmount === null
          ? "no transactions yet"
          : `transaction${Number(totalSalesAmount) === 1 ? "" : "s"} completed`,
      icon: <ShoppingCart size={22} />,
      color: "purple",
    },
    {
      roles: ["Admin", "Manager"],
      label: "Critical Alerts",
      value: String(criticalAlerts),
      sub: "Products needing attention",
      icon: <TrendingDown size={22} />,
      color: "red",
    },
  ].filter((card) => card.roles.includes(currentRole));

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="dash-skel-welcome">
          <div className="dash-skel-line w-48" />
          <div className="dash-skel-line w-72 short" />
        </div>

        <div className="dashboard-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card dash-skel-card">
              <div className="dash-skel-card-left">
                <div className="dash-skel-line w-24 short" />
                <div className="dash-skel-line w-16" />
                <div className="dash-skel-line w-32 short" />
              </div>
              <div className="dash-skel-icon" />
            </div>
          ))}
        </div>

        <div className="dashboard-alerts">
          {[1, 2].map((i) => (
            <div key={i} className="alert-card">
              <div className="dash-skel-alert-header">
                <div className="dash-skel-line w-32" />
                <div className="dash-skel-badge" />
              </div>
              {[1, 2, 3].map((j) => (
                <div key={j} className="dash-skel-alert-row">
                  <div className="dash-skel-line w-full short" />
                  <div className="dash-skel-line w-48 short" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="activity-card">
          <div className="dash-skel-alert-header">
            <div className="dash-skel-line w-32" />
            <div className="dash-skel-badge" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="dash-skel-activity-row">
              <div className="dash-skel-activity-icon" />
              <div className="dash-skel-activity-lines">
                <div className="dash-skel-line w-48" />
                <div className="dash-skel-line w-full short" />
                <div className="dash-skel-line w-32 short" />
              </div>
            </div>
          ))}
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
          <span className="expiry-admin">({currentRole})</span>
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

      {(isAdmin || isManager) && (
        <div className="dashboard-alerts">
          <div className="alert-card">
            <div className="alert-card-header">
              <div className="alert-card-title">
                <AlertTriangle size={18} className="alert-icon-red" />
                <h4>Expiry Alerts</h4>
              </div>
              <span className="alert-badge alert-badge-red">
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
                      item.daysRemaining <= 3 ? "critical" : "expiring"
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
                          item.daysRemaining <= 3 ? "red" : "orange"
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
                      <span className="lowstock-count">{item.totalStock}</span>
                      <span className="lowstock-label">units left</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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
                      ? "activity-icon-sale"
                      : act.type === "receiving"
                        ? "activity-icon-receive"
                        : "activity-icon-create"
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
