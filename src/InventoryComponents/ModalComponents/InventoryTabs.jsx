import React from "react";
import { Package, ClipboardPlus, AlertTriangle, Clock, XCircle } from "lucide-react";

const tabIcons = {
  "All Products": <Package size={16} />,
  "Stock Entry": <ClipboardPlus size={16} />,
  "Low Stock": <AlertTriangle size={16} />,
//   "Stock History": <Clock size={16} />,
  "Out of Stock": <XCircle size={16} />,
};

const InventoryTabs = ({ tabs, activeTab, setActiveTab, lowStockCount }) => {
  return (
    <div className="inv-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`inv-tab ${activeTab === tab ? "inv-tab-active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tabIcons[tab]}
          <span>{tab}</span>
          {tab === "Low Stock" && lowStockCount > 0 && (
            <span className="inv-tab-badge">{lowStockCount}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default InventoryTabs;