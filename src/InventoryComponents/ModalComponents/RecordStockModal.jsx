import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import "./ModalStyles/RecordStockModal.css";
import Logo from "../../Components/Logo";
import { recordStockEntry } from "../../API/inventoryApi";

const RecordStockModal = ({ onClose, visible, onAddProduct, product }) => {
  const [supplierName, setSupplierName] = useState("");
  const [packageQuantity, setPackageQuantity] = useState("");
  const [unitPerPackage, setUnitPerPackage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expiryError, setExpiryError] = useState("");

  useEffect(() => {
    if (product) {
      setPackageQuantity(product.packageQuantity || "");
      setUnitPerPackage(product.unitPerPackage || "");
    }
  }, [product]);

  if (!visible) return null;

  const selectedName =
    product?.name ||
    product?.productName ||
    product?.title ||
    "Unnamed Product";

  const availableStock = product?.availableStock ?? 0;
  const totalStock = product?.totalStock ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (new Date(expiryDate) < tomorrow) {
      setExpiryError("Expiry date must be a future date.");
      return;
    }
    setExpiryError("");

    const payload = {
      inventoryId: product?.inventoryId,
      supplier: supplierName,
      expiryDate,
      packageType: product?.packageType,
      packageQuantity: parseInt(packageQuantity),
      unitPerPackage: parseInt(unitPerPackage),
    };

    try {
      setLoading(true);
      const res = await recordStockEntry(payload);
      onAddProduct?.(res?.data);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSupplierName("");
        setPackageQuantity("");
        setUnitPerPackage("");
        setExpiryDate("");
        onClose();
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to restock product");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const totalAdded =
      (Number(packageQuantity) || 0) * (Number(unitPerPackage) || 0);
    const newTotalStock = (Number(totalStock) || 0) + totalAdded;

    return (
      <div className="record-overlay-success">
        <div className="record-modal-success">
          <div className="record-success-header">
            <CheckCircle size={45} color="#00A63E" />
            <h2>Success!</h2>
            <p>
              Stock Entry: {totalAdded} units received from {supplierName}
            </p>
          </div>

          <div className="record-success-details">
            <div className="record-success-row">
              <span className="record-success-label">Product</span>
              <span className="record-success-value">{selectedName}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Previous Stock</span>
              <span className="record-success-value">{totalStock}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Updated Stock</span>
              <span className="record-success-value record-success-green">
                +{totalAdded}
              </span>
            </div>
            <div className="record-success-row total-row">
              <span className="record-success-label">Total Stock Now</span>
              <span className="record-success-value">{newTotalStock}</span>
            </div>
            <div className="record-success-row">
              <span className="record-success-label">Timestamp</span>
              <span className="record-success-timestamp">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          <button
            className="record-back-btn"
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="record-overlay" onClick={onClose}>
      <div className="record-modal" onClick={(e) => e.stopPropagation()}>
        <div className="record-modal-header">
          <Logo variant="black" />
          <button className="record-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <h2 className="record-title">Restock Product</h2>

        {error && <div className="record-allocation-error">{error}</div>}

        <form className="record-form" onSubmit={handleSubmit}>
          {product && (
            <div className="record-card">
              <div className="record-product-preview">
                <h3 style={{ marginBottom: 6 }}>{selectedName}</h3>

                <p style={{ color: "#6B7280", fontSize: 14 }}>
                  Current Stock:{" "}
                  <strong>
                    {availableStock} available • {totalStock} total
                  </strong>
                </p>

                <p style={{ color: "#6B7280", fontSize: 13 }}>
                  Package Type: <strong>{product?.packageType || "N/A"}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="record-card">
            <div className="record-row">
              <div className="record-field">
                <label>Package Qty *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={packageQuantity}
                  onChange={(e) =>
                    setPackageQuantity(e.target.value.replace(/[^\d]/g, ""))
                  }
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </div>

              <div className="record-field">
                <label>Units Per Package *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={unitPerPackage}
                  onChange={(e) =>
                    setUnitPerPackage(e.target.value.replace(/[^\d]/g, ""))
                  }
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className="record-total-units">
              {(Number(packageQuantity) || 0) * (Number(unitPerPackage) || 0)}{" "}
              units
            </div>

            <div className="record-row">
              <div className="record-field">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  required
                />
              </div>

              <div className="record-field">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={expiryDate}
                  min={
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  }
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    setExpiryError("");
                  }}
                  required
                />
                {expiryError && (
                  <div className="record-field-error">{expiryError}</div>
                )}
              </div>
            </div>

            <div className="record-actions">
              <button
                type="button"
                className="record-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="record-submit-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Restock"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordStockModal;
