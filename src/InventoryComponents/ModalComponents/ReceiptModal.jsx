import React from "react";
import "./ModalStyles/ReceiptModal.css";
import { CheckCircle, Printer } from "lucide-react";

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const sale = receipt.sale;
  const items = receipt.items || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-modal">
        <div className="receipt-success-header">
          <CheckCircle size={54} strokeWidth={1.8} />

          <h2>Sale Complete!</h2>

          <p>
            Receipt #
            {sale?.saleNumber || "000000"}
          </p>
        </div>

        <div className="receipt-body">
          <h3 className="receipt-store-name">
            INVENTRA
          </h3>

          <p className="receipt-date">
            {new Date(sale?.createdAt).toLocaleDateString("en-NG", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {" "}
            {new Date(sale?.createdAt).toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="receipt-number">
            Receipt: {sale?.saleNumber}
          </p>

          <div className="receipt-divider" />

          <div className="receipt-items">
            {items.map((item, index) => (
              <div
                key={index}
                className="receipt-item"
              >
                <div className="receipt-item-top">
                  <span>{item.productName}</span>

                  <span>
                    ₦
                    {Number(item.subtotal).toLocaleString("en-NG")}
                  </span>
                </div>

                <div className="receipt-item-bottom">
                  ₦
                  {Number(item.unitPrice || 0).toLocaleString("en-NG")}
                  {" × "}
                  {item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          <div className="receipt-summary-row">
            <span>Subtotal</span>

            <span>
              ₦
              {Number(sale?.totalAmount).toLocaleString("en-NG")}
            </span>
          </div>

          <div className="receipt-total-row">
            <span>Total</span>

            <span>
              ₦
              {Number(sale?.totalAmount).toLocaleString("en-NG")}
            </span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-footer">
            <p>Thank you for your purchase!</p>

            <p>
              Powered by INVENTRA POS
            </p>
          </div>
        </div>

        <div className="receipt-actions">
          <button
            className="receipt-print-btn"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print Receipt
          </button>

          <button
            className="receipt-close-btn"
            onClick={onClose}
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;