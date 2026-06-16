import React from "react";
import { AlertTriangle, Clock, X } from "lucide-react";
import "./AlertModal.css";

const AlertModal = ({
  isOpen,
  type, // "expired", "expiring", "lowstock"
  items,
  onDismiss,
  onViewDetails,
  onRestock,
}) => {
  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case "expired":
        return {
          title: `A Expired Products Alert`,
          subtitle: `${items.length} product${items.length !== 1 ? "s" : ""} ${
            items.length !== 1 ? "have" : "has"
          } expired`,
          headerBgColor: "#ef4444",
          headerIcon: <AlertTriangle size={20} color="white" />,
          headerBadgeBg: "#fee2e2",
          headerBadgeColor: "#ef4444",
          actionText:
            "Action Required: The following products have passed their expiry date. Please remove them from shelves immediately to prevent sale and potential health risks.",
          actionBgColor: "#fee2e2",
          actionBorderColor: "#fecaca",
          actionTextColor: "#991b1b",
          itemBgColor: "#fef2f2",
          itemBorderColor: "#fecaca",
          statusBadgeBg: "#fee2e2",
          statusBadgeColor: "#dc2626",
          buttonBg: "#ef4444",
          buttonHover: "#dc2626",
          secondaryButton: "Go to Expiry Management",
          secondaryBgColor: "#ef4444",
          daysField: "daysLeft",
        };
      case "expiring":
        return {
          title: `Products Expiring Soon`,
          subtitle: `${items.length} product${items.length !== 1 ? "s" : ""} ${
            items.length !== 1 ? "are" : "is"
          } expiring in the next 7 days`,
          headerBgColor: "#f97316",
          headerIcon: <Clock size={20} color="white" />,
          headerBadgeBg: "#fff7ed",
          headerBadgeColor: "#f97316",
          actionText: "",
          itemBgColor: "#fff7ed",
          itemBorderColor: "#fed7aa",
          statusBadgeBg: "#fef3c7",
          statusBadgeColor: "#f59e0b",
          buttonBg: "#f97316",
          buttonHover: "#ea580c",
          secondaryButton: "Go to Expiry Management",
          secondaryBgColor: "#f97316",
          daysField: "daysLeft",
        };
      case "lowstock":
        return {
          title: `Low Stock Alert`,
          subtitle: `The following products are below minimum stock level`,
          headerBgColor: "#ea580c",
          headerIcon: <AlertTriangle size={20} color="white" />,
          headerBadgeBg: "#fff7ed",
          headerBadgeColor: "#ea580c",
          actionText: "",
          itemBgColor: "#fff7ed",
          itemBorderColor: "#fed7aa",
          statusBadgeBg: "#ddd6fe",
          statusBadgeColor: "#6366f1",
          buttonBg: "#6366f1",
          buttonHover: "#4f46e5",
          secondaryButton: "Go to Inventory Management",
          secondaryBgColor: "#ea580c",
          daysField: "units",
        };
      default:
        return {};
    }
  };

  const config = getConfig();

  const handleRestock = (item) => {
    if (onRestock) {
      onRestock(item);
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onDismiss}>
      <div
        className="alert-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="alert-modal-header"
          style={{ backgroundColor: config.headerBgColor }}
        >
          <div className="alert-modal-header-content">
            <div className="alert-modal-icon">{config.headerIcon}</div>
            <div className="alert-modal-titles">
              <h2 className="alert-modal-title">{config.title}</h2>
              <p className="alert-modal-subtitle">{config.subtitle}</p>
            </div>
          </div>
          <button
            className="alert-modal-close"
            onClick={onDismiss}
            style={{ color: "white" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Action Required Box */}
        {config.actionText && (
          <div
            className="alert-modal-action-box"
            style={{
              backgroundColor: config.actionBgColor,
              borderColor: config.actionBorderColor,
              color: config.actionTextColor,
            }}
          >
            <strong>Action Required:</strong> {config.actionText}
          </div>
        )}

        {/* Items List */}
        <div className="alert-modal-items">
          {items.map((item, index) => (
            <div
              key={index}
              className="alert-modal-item"
              style={{
                backgroundColor: config.itemBgColor,
                borderColor: config.itemBorderColor,
              }}
            >
              <div className="alert-modal-item-icon">
                <AlertTriangle size={16} color={config.statusBadgeColor} />
              </div>

              <div className="alert-modal-item-content">
                <p className="alert-modal-item-name">{item.name}</p>
                <p className="alert-modal-item-meta">
                  {item.category && `${item.category} • `}
                  {type === "lowstock"
                    ? `${item.units} units`
                    : `${item.quantity} units`}
                  {item.expiryDate && ` • ${item.expiryDate}`}
                </p>
              </div>

              <div className="alert-modal-item-right">
                {type === "lowstock" ? (
                  <button
                    className="alert-modal-restock-btn"
                    style={{
                      backgroundColor: config.buttonBg,
                      color: "white",
                    }}
                    onClick={() => handleRestock(item)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = config.buttonHover)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = config.buttonBg)
                    }
                  >
                    Restock
                  </button>
                ) : (
                  <span
                    className="alert-modal-days-badge"
                    style={{
                      backgroundColor: config.statusBadgeBg,
                      color: config.statusBadgeColor,
                    }}
                  >
                    {item[config.daysField]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="alert-modal-footer">
          <button
            className="alert-modal-btn alert-modal-btn-secondary"
            onClick={onDismiss}
          >
            {type === "lowstock" ? "Remind Me Later" : "Dismiss"}
          </button>
          <button
            className="alert-modal-btn alert-modal-btn-primary"
            style={{
              backgroundColor: config.secondaryBgColor,
            }}
            onClick={onViewDetails}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = config.buttonHover)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = config.secondaryBgColor)
            }
          >
            {config.secondaryButton} →
          </button>
        </div>

        {type === "lowstock" && (
          <p className="alert-modal-footer-text">
            Click "Go to Inventory Management" page to see all details
          </p>
        )}
        {type !== "lowstock" && (
          <p className="alert-modal-footer-text">
            Click "Go to Expiry Management" to view and manage all expired
            products
          </p>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
