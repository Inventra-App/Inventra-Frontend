import React from "react";
import { X, Archive, Package2, Leaf } from "lucide-react";
import "../ModalComponents/ModalStyles/ProductTypeModal.css";

const ProductTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="product-type-overlay" onClick={onClose}>
      <div className="product-type-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-type-header">
          <div>
            <h2>Select Product Type</h2>
            <p>Choose the type of product you want to add.</p>
          </div>

          <button className="product-type-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="product-type-options">
          <button
            className="product-type-card expiry"
            onClick={() => onSelect(true)}
          >
            <div className="product-type-icon expiry-icon">
              <Archive size={34} />
            </div>

            <h3>Expiry Products</h3>

            <p>
              Products with an expiry date such as food, drinks and medicine.
            </p>
          </button>

          <button
            className="product-type-card non-expiry"
            onClick={() => onSelect(false)}
          >
            <div className="product-type-icon non-expiry-icon">
              <Leaf size={34} />
            </div>

            <h3>Non-expiry Products</h3>

            <p>
              Products that do not expire such as electronics and household
              items.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeModal;
