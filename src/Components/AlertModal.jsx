import React from "react";
import {
  AlertTriangle,
  Box,
  Calendar,
  Clock,
  MapPin,
  Package,
  X,
} from "lucide-react";
import "./AlertModal.css";

const configs = {
  expired: {
    tone: "expired",
    title: "Expired Products Alert",
    subtitle: (count) =>
      `${count} product${count === 1 ? "" : "s"} ${count === 1 ? "has" : "have"} expired`,
    headerIcon: <AlertTriangle size={20} />,
    actionText:
      "The following products have passed their expiry date. Please remove them from shelves immediately to prevent sale and potential health risks.",
    statusText: "EXPIRED",
    secondaryButton: "Go to Expiry Management",
    secondaryTarget: "Expiry Management",
    footerText:
      'Click "Go to Expiry Management" to view and manage all expired products',
  },
  expiring: {
    tone: "expiring",
    title: "Products Expiring Soon",
    subtitle: (count) =>
      `${count} product${count === 1 ? " is" : "s are"} expiring in the next 7 days`,
    headerIcon: <Clock size={20} />,
    actionText: "",
    statusText: "",
    secondaryButton: "Go to Expiry Management",
    secondaryTarget: "Expiry Management",
    footerText: 'Click "Go to Expiry Management" to see all details',
  },
  lowstock: {
    tone: "lowstock",
    title: "Low Stock Alert",
    subtitle: () => "The following products are below minimum stock level",
    headerIcon: <Clock size={20} />,
    actionText: "",
    statusText: "",
    secondaryButton: "Go to Inventory Management",
    secondaryTarget: "Inventory Management",
    footerText: 'Click "Go to inventory management" page to see all details',
  },
};

const AlertModal = ({
  isOpen,
  type,
  items = [],
  onDismiss,
  onViewDetails,
  onRestock,
}) => {
  if (!isOpen) return null;

  const config = configs[type] ?? configs.expired;
  const isLowStock = type === "lowstock";
  const isExpired = type === "expired";
  const isExpiring = type === "expiring";

  const handleRestock = (item) => {
    if (onRestock) onRestock(item);
  };

  return (
    <div className="alert-modal-overlay" onClick={onDismiss}>
      <div
        className="alert-modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`alert-modal-header alert-modal-header-${config.tone}`}>
          <div className="alert-modal-header-content">
            <div className="alert-modal-icon">{config.headerIcon}</div>
            <div className="alert-modal-titles">
              <h2 className="alert-modal-title">{config.title}</h2>
              <p className="alert-modal-subtitle">
                {config.subtitle(items.length)}
              </p>
            </div>
          </div>

          <button
            className="alert-modal-close"
            type="button"
            onClick={onDismiss}
            aria-label="Close alert"
          >
            <X size={22} />
          </button>
        </div>

        {config.actionText && (
          <div
            className={`alert-modal-action-box alert-modal-action-${config.tone}`}
          >
            <strong>Action Required:</strong> {config.actionText}
          </div>
        )}

        <div className="alert-modal-items">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${item.batch}-${item.expiryDate}`}
              className={`alert-modal-item alert-modal-item-${config.tone}`}
            >
              <div
                className={`alert-modal-item-icon alert-modal-item-icon-${config.tone}`}
              >
                <Package size={16} />
              </div>

              <div className="alert-modal-item-content">
                <p className="alert-modal-item-name">{item.name}</p>
                <p className="alert-modal-item-meta">
                  {item.category && <span>{item.category}</span>}
                  <span>
                    <Box size={12} /> {isLowStock ? item.units : item.quantity}{" "}
                    units
                  </span>
                  {isExpired && item.batch && (
                    <span>
                      <MapPin size={12} /> {item.batch}
                    </span>
                  )}
                </p>

                {isExpired && (
                  <div className="alert-modal-item-actions">
                    <button
                      type="button"
                      className="alert-modal-note-btn"
                      onClick={onDismiss}
                    >
                      Noted
                    </button>
                    <button
                      type="button"
                      className="alert-modal-detail-btn"
                      onClick={onViewDetails}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>

              <div className="alert-modal-item-right">
                {isLowStock ? (
                  <>
                    {item.expiryDate && item.expiryDate !== "No date" && (
                      <span className="alert-modal-date">
                        <Calendar size={12} /> {item.expiryDate}
                      </span>
                    )}
                    {item.batch && (
                      <span className="alert-modal-days-badge">
                        {item.batch}
                      </span>
                    )}
                    <button
                      className="alert-modal-restock-btn"
                      type="button"
                      onClick={() => {
                        handleRestock(item);
                      }}
                    >
                      Restock
                    </button>
                  </>
                ) : isExpiring ? (
                  <>
                    <span
                      className={`alert-modal-date alert-modal-date-${config.tone}`}
                    >
                      <Calendar size={12} /> {item.expiryDate}
                    </span>
                    <span
                      className={`alert-modal-age alert-modal-age-${config.tone}`}
                    >
                      {item.daysLeft}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className={`alert-modal-status-badge alert-modal-status-${config.tone}`}
                    >
                      {config.statusText}
                    </span>
                    <span
                      className={`alert-modal-date alert-modal-date-${config.tone}`}
                    >
                      <Calendar size={12} /> {item.expiryDate}
                    </span>
                    <span
                      className={`alert-modal-age alert-modal-age-${config.tone}`}
                    >
                      {item.daysLeft}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="alert-modal-footer">
          <button
            className="alert-modal-btn alert-modal-btn-secondary"
            type="button"
            onClick={onDismiss}
          >
            {isLowStock ? "Remind Me Later" : "Dismiss"}
          </button>
          <button
            className={`alert-modal-btn alert-modal-btn-primary alert-modal-btn-${config.tone}`}
            type="button"
            onClick={onViewDetails}
          >
            {config.secondaryButton}
          </button>
        </div>

        <p className="alert-modal-footer-text">{config.footerText}</p>
      </div>
    </div>
  );
};

export default AlertModal;
