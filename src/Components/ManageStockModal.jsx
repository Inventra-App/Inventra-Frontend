import React, { useState } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import "../Css/ManageStockModal.css";
import { moveInventoryStock } from "../API/inventoryApi";

const ManageStockModal = ({ inventoryId, product, onClose, onUpdate }) => {
  if (!product) return null;

  const [actionType, setActionType] = useState("");
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const actionTypes = [
    "TRANSFER_TO_AVAILABLE",
    "RETURN_TO_BACKROOM",
    "TRANSFER_TO_WRITEOFF",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inventoryId) {
      setError("Inventory record ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      moveFrom,
      moveTo,
      quantity: parseInt(quantity),
      ...(actionType ? { actionType } : {}),
    };

    try {
      await moveInventoryStock(inventoryId, payload);
      setSuccess(true);
      onUpdate();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3500);
    } catch (err) {
      console.error("Move stock error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to move stock. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="manage-overlay" onClick={onClose}>
        <div
          className="manage-success-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="manage-success">
            <div className="manage-success-icon">
              <CheckCircle size={36} color="#00A63E" strokeWidth={1.5} />
            </div>

            <h3 className="manage-success-title">Stock Moved!</h3>

            <div className="manage-success-details">
              <div className="manage-success-row">
                <span className="manage-success-label">Product</span>
                <span className="manage-success-value">{product.name}</span>
              </div>

              <div className="manage-success-row">
                <span className="manage-success-label">Moved</span>
                <span className="manage-success-value">{quantity} units</span>
              </div>

              <div className="manage-success-row">
                <span className="manage-success-label">From</span>
                <span className="manage-success-value">{moveFrom}</span>
              </div>

              <div className="manage-success-row">
                <span className="manage-success-label">To</span>
                <span className="manage-success-value">{moveTo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-overlay" onClick={onClose}>
      <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
        <div className="manage-header">
          <h3>Manage Stock</h3>
          <button type="button" className="manage-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="manage-product-info">
          <p className="manage-product-name">{product.name}</p>

          <div className="manage-stock-row">
            <div>
              <p className="manage-stock-label">Total Inventory</p>
              <p className="manage-stock-value manage-dark">
                {product.availableStock + product.backroomStock}
              </p>
            </div>

            <div>
              <p className="manage-stock-label">Available Stock</p>
              <p className="manage-stock-value manage-green">
                {product.availableStock}
              </p>
            </div>

            <div>
              <p className="manage-stock-label">Backroom Stock</p>
              <p className="manage-stock-value manage-purple">
                {product.backroomStock}
              </p>
            </div>

            <div>
              <p className="manage-stock-label">Write-off Stock</p>
              <p className="manage-stock-value" style={{ color: "#E7000B" }}>
                {product.writeOffStock || 0}
              </p>
            </div>
          </div>
        </div>

        <form className="manage-form" onSubmit={handleSubmit}>
          <div className="manage-field">
            <label>Action Type </label>

            <select
              value={actionType}
              onChange={(e) => {
                const value = e.target.value;

                setActionType(value);

                if (value === "TRANSFER_TO_AVAILABLE") {
                  setMoveFrom("backroom stock");
                  setMoveTo("available stock");
                }

                if (value === "RETURN_TO_BACKROOM") {
                  setMoveFrom("available stock");
                  setMoveTo("backroom stock");
                }

                if (value === "TRANSFER_TO_WRITEOFF") {
                  setMoveFrom("");
                  setMoveTo("write-off stock");
                }
              }}
            >
              <option value="">Select Action Type</option>

              <option value="TRANSFER_TO_AVAILABLE">
                Transfer to Available
              </option>

              <option value="RETURN_TO_BACKROOM">
                Return to Backroom (Excess Product)
              </option>

              <option value="TRANSFER_TO_WRITEOFF" style={{ color: "#E7000B" }}>
                Transfer to Write-off Stock
              </option>
            </select>
          </div>

          {actionType === "TRANSFER_TO_WRITEOFF" && (
            <p
              style={{
                fontSize: "12px",
                color: "#E7000B",
                marginTop: "6px",
              }}
            >
              Select whether the stock should be written off from Available
              Stock or Backroom Stock.
            </p>
          )}

          <div className="manage-move-row">
            <div className="manage-field manage-field-half">
              <label>Move From</label>
              <select
                required
                value={moveFrom}
                onChange={(e) => setMoveFrom(e.target.value)}
              >
                <option value=""></option>
                <option value="available stock">Available Stock</option>
                <option value="backroom stock">Backroom Stock</option>
              </select>
            </div>

            <ArrowRight size={18} className="manage-arrow" />

            <div className="manage-field manage-field-half">
              <label>Move To</label>
              <select
                required
                value={moveTo}
                onChange={(e) => setMoveTo(e.target.value)}
              >
                <option value=""></option>
                <option value="available stock">Available Stock</option>
                <option value="backroom stock">Backroom Stock</option>
                <option value="write-off stock">Write-off Stock</option>
              </select>
            </div>
          </div>

          <div className="manage-field">
            <label>Quantity</label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#DC2626",
                backgroundColor: "#FEF2F2",
                border: "1.5px solid #FECACA",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "12px",
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div className="manage-actions">
            <button
              type="button"
              className="manage-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="manage-confirm-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Action"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStockModal;
