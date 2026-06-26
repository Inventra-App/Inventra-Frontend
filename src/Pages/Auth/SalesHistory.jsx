import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  Package,
  X,
} from "lucide-react";
import { getSalesHistory } from "../../API/salesPosApi";
import "./Css/SalesHistory.css";

const ITEMS_PER_PAGE = 10;

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSalesHistory(page, ITEMS_PER_PAGE);
      const list = Array.isArray(res?.data) ? res.data : [];
      const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setSales(sorted);
      setPagination(res?.pagination ?? null);
    } catch (err) {
      console.error("SalesHistory fetch error:", err);
      setError("Failed to load sales history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales(currentPage);
  }, [fetchSales, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = pagination?.totalPages ?? 1;
  const totalSales = pagination?.totalSales ?? sales.length;

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="sh-pagination">
        <button
          className="sh-page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            className={`sh-page-btn ${page === currentPage ? "sh-page-active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="sh-page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <section className="sh-container">
      <div className="sh-header">
        <div className="sh-header-left">
          <div className="sh-header-icon">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h3 className="sh-title">Sales History</h3>
            <p className="sh-subtitle">All transactions for your supermarket</p>
          </div>
        </div>
        <span className="sh-total-badge">{totalSales} total sales</span>
      </div>

      {loading ? (
        <div className="sh-state-box">
          <div className="sh-spinner" />
          <p>Loading sales history...</p>
        </div>
      ) : error ? (
        <div className="sh-state-box sh-error">
          <p>{error}</p>
          <button
            className="sh-retry-btn"
            onClick={() => fetchSales(currentPage)}
          >
            Retry
          </button>
        </div>
      ) : sales.length === 0 ? (
        <div className="sh-state-box sh-empty">
          <ShoppingCart size={40} className="sh-empty-icon" />
          <p className="sh-empty-title">No sales yet</p>
          <p className="sh-empty-sub">Completed sales will appear here.</p>
        </div>
      ) : (
        <>
          <div className="sh-list">
            {sales.map((sale) => (
              <button
                key={sale._id}
                className="sh-item"
                type="button"
                onClick={() => setSelectedSale(sale)}
              >
                <div className="sh-item-left">
                  <div className="sh-sale-icon">
                    <CreditCard size={18} />
                  </div>
                  <div className="sh-item-info">
                    <p className="sh-sale-number">Sale #{sale.saleNumber}</p>
                    <p className="sh-sale-meta">
                      <Package size={13} />
                      {sale.totalItems} item{sale.totalItems !== 1 ? "s" : ""}
                      <span className="sh-dot" />
                      <span
                        className={`sh-payment-tag sh-payment-${sale.paymentMethod}`}
                      >
                        {sale.paymentMethod}
                      </span>
                    </p>
                    <p className="sh-sale-date">
                      <Calendar size={13} />
                      {formatDate(sale.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="sh-item-right">
                  <strong className="sh-amount">
                    {formatNaira(sale.totalAmount)}
                  </strong>
                  <span className="sh-view-label">View</span>
                </div>
              </button>
            ))}
          </div>

          <div className="sh-footer">
            <p className="sh-showing">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalSales)} of{" "}
              {totalSales} sales
            </p>
            {renderPagination()}
          </div>
        </>
      )}

      {selectedSale && (
        <div
          className="sh-modal-backdrop"
          onClick={() => setSelectedSale(null)}
        >
          <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sh-modal-header">
              <div className="sh-modal-title">
                <div className="sh-modal-icon">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3>Sale #{selectedSale.saleNumber}</h3>
                  <p>{formatDate(selectedSale.createdAt)}</p>
                </div>
              </div>
              <button
                className="sh-modal-close"
                type="button"
                onClick={() => setSelectedSale(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sh-modal-content">

            <div className="sh-modal-amount">
              <span>TOTAL AMOUNT</span>
              <strong>{formatNaira(selectedSale.totalAmount)}</strong>
            </div>

            <div className="sh-modal-section">
              <h4>ITEMS PURCHASED</h4>

              <div className="sh-items-list">
                {(selectedSale.items || []).map((item, index) => (
                  <div key={index} className="sh-item-row">
                    <div className="sh-item-left">
                      <div className="sh-item-icon">
                        <Package size={16} />
                      </div>

                      <div>
                        <p className="sh-item-name">{item.productName}</p>

                        <span className="sh-item-price">
                          {formatNaira(item.unitPrice)} each
                        </span>
                      </div>
                    </div>

                    <div className="sh-item-right">
                      <span className="sh-item-qty">×{item.quantity}</span>

                      <strong>{formatNaira(item.subtotal)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sh-modal-section">
              <h4>TRANSACTION DETAILS</h4>
              <div className="sh-modal-grid">
                <div className="sh-modal-field">
                  <span>Sale Number</span>
                  <strong>#{selectedSale.saleNumber}</strong>
                </div>
                <div className="sh-modal-field">
                  <span>Payment Method</span>
                  <strong
                    className={`sh-payment-tag sh-payment-${selectedSale.paymentMethod}`}
                  >
                    {selectedSale.paymentMethod}
                  </strong>
                </div>
                <div className="sh-modal-field">
                  <span>Total Items</span>
                  <strong>
                    {selectedSale.totalItems} item
                    {selectedSale.totalItems !== 1 ? "s" : ""}
                  </strong>
                </div>
                <div className="sh-modal-field">
                  <span>Total Amount</span>
                  <strong>{formatNaira(selectedSale.totalAmount)}</strong>
                </div>
                <div className="sh-modal-field sh-modal-field-full">
                  <span>Date & Time</span>
                  <strong>{formatDate(selectedSale.createdAt)}</strong>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesHistory;
