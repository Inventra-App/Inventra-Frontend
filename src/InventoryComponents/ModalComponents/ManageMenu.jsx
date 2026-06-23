import React from "react";
import { PackagePlus, ArrowRightLeft } from "lucide-react";

const ManageMenu = ({ product, onClose, onRestock, onMove }) => {
  return (
    <div className="manage-dropdown-overlay" onClick={onClose}>
      <div className="manage-dropdown" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { onRestock(product); onClose(); }}>
          <PackagePlus size={18} /> Restock Product
        </button>
        <button onClick={() => { onMove(product); onClose(); }}>
          <ArrowRightLeft size={18} /> Move Stock
        </button>
      </div>
    </div>
  );
};

export default ManageMenu;