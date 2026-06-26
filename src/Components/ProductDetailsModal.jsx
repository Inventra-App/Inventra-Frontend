import React, { useEffect, useState } from "react";
import { Package, Pencil, X } from "lucide-react";
import "../Css/ProductDetailsModal.css";
import {
  getBatchesByInventoryId,
  getStockMovementHistory,
} from "../API/inventoryApi";

const ProductDetailsModal = ({ product, onClose, onManage }) => {
  const [batchData, setBatchData] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [movementHistory, setMovementHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchBatchInfo = async () => {
      if (product?.inventoryId) {
        setLoadingBatch(true);
        try {
          console.log("PRODUCT:", product);
          console.log("INVENTORY ID:", product?.inventoryId);
          const res = await getBatchesByInventoryId(product.inventoryId);
          const batches = Array.isArray(res?.data)
            ? res.data
            : res?.data
              ? [res.data]
              : [];
          setBatchData(batches);
        } catch (err) {
          console.error("Error fetching batch:", err);
          setBatchData([]);
        } finally {
          setLoadingBatch(false);
        }
      } else {
        setLoadingBatch(false);
      }
    };
    fetchBatchInfo();
  }, [product]);

  useEffect(() => {
    const fetchMovementHistory = async () => {
      if (!product?.inventoryId) {
        setLoadingHistory(false);
        return;
      }

      setLoadingHistory(true);

      try {
        const res = await getStockMovementHistory(product.inventoryId);
        setMovementHistory(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching stock history:", err);
        setMovementHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchMovementHistory();
  }, [product]);

  if (!product) return null;

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <h3>Product Details</h3>
          <button className="inv-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="inv-modal-product">
          <div className="inv-modal-icon">
            <Package size={30} />
          </div>
          <div>
            <h4>{product.name}</h4>
            <div className="inv-modal-tags">
              <span className="inv-modal-batch-tag">{product.batch}</span>
              <span className="inv-modal-category-tag">{product.category}</span>
            </div>
          </div>
        </div>

        <div className="inv-modal-section">
          <h5>Inventory Information</h5>
          <div className="inv-modal-grid">
            <div>
              <p className="inv-modal-label">Available Stock</p>
              <p className="inv-modal-value">{product.availableStock}</p>
            </div>
            <div>
              <p className="inv-modal-label">Backroom Stock</p>
              <p className="inv-modal-value inv-modal-blue">
                {product.backroomStock}
              </p>
            </div>

            <div>
              <p className="inv-modal-label">Write-off Stock</p>
              <p className="inv-modal-value inv-modal-red">
                {product.writeOffStock || 0}
              </p>
            </div>

            <div>
              <p className="inv-modal-label">Total Stock</p>
              <p className="inv-modal-value inv-modal-green">
                {product.totalStock}
              </p>
            </div>
            <div>
              <p className="inv-modal-label">Unit Price</p>
              <p className="inv-modal-value">
                ₦
                {Number(product.price || 0).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="inv-modal-label">Total Value</p>
              <p className="inv-modal-value inv-modal-green">
                ₦
                {(
                  Number(product.totalStock || 0) * Number(product.price || 0)
                ).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="inv-modal-label">Date Added</p>
              <p className="inv-modal-values">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="inv-modal-section">
          <h5>Batch Information</h5>

          {loadingBatch ? (
            <p className="inv-modal-empty">Loading batch info...</p>
          ) : batchData.length > 0 ? (
            <div className="inv-modal-batch-list">
              {batchData.map((batch) => (
                <div key={batch._id} className="inv-modal-batch-info">
                  <p className="inv-modal-batch-id">
                    {batch.batchCode || "N/A"}
                  </p>

                  <p className="inv-modal-batch-meta">
                    Quantity: {batch.quantityRemaining || 0}
                  </p>

                  <p className="inv-modal-batch-meta">
                    Supplier: {batch.supplier || "N/A"}
                  </p>

                  <p className="inv-modal-batch-meta">
                    Expires:{" "}
                    {batch.expiryDate
                      ? new Date(batch.expiryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "No expiry date"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="inv-modal-empty">No batch information available</p>
          )}
        </div>

        <div className="inv-modal-section">
          <h5>Stock Movement History</h5>

          {loadingHistory ? (
            <p className="inv-modal-empty">Loading stock movements...</p>
          ) : movementHistory.length > 0 ? (
            <div className="inv-modal-history-list">
              {movementHistory.map((item) => (
                <div key={item._id} className="inv-modal-history-item">
                  <div className="inv-history-top">
                    <span className="inv-history-badge">Stock Update</span>

                    <span className="inv-history-date">
                      {new Date(
                        item.triggeredAt || item.createdAt,
                      ).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="inv-history-description">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="inv-modal-empty">No stock movements recorded</p>
          )}
        </div>

        <button className="inv-modal-manage-btn" onClick={onManage}>
          <Pencil size={14} /> Manage Stock
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
