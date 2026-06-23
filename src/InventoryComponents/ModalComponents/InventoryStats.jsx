import React from "react";
import { Package, AlertTriangle, Truck, XCircle } from "lucide-react";

const InventoryStats = ({ stats }) => {
  const statCards = [
    { label: "Total Products", value: stats.total, icon: <Package size={22} />, color: "blue" },
    { label: "Low Stock Items", value: stats.lowStock, icon: <AlertTriangle size={22} />, color: "orange" },
    { label: "Stock Entry", value: stats.entries, icon: <Truck size={22} />, color: "green" },
    { label: "Out of Stock", value: stats.outOfStock, icon: <XCircle size={22} />, color: "red" },
  ];

  return (
    <div className="inventory-stats">
      {statCards.map((stat, idx) => (
        <div key={idx} className="inv-stat-card">
          <div className={`inv-stat-icon inv-stat-${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="inv-stat-label">{stat.label}</p>
            <h3 className="inv-stat-value">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;