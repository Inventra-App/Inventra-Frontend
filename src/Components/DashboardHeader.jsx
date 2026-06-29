import React from "react";
import { useSelector } from "react-redux";
import { User, Shield, Store } from "lucide-react";
import "../Css/DashboardHeader.css";
import { getSessionUser } from "../Utils/sessionUser";

const DashboardHeader = () => {
  const reduxUser = useSelector((state) => state.apiInfo?.user);
  const user = reduxUser ?? getSessionUser();

  const fullName =
    user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const role =
    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dash-header">
      {role === "Cashier" && (
        <div className="cashier-profile-card">
          <div className="cashier-top">
            <div className="cashier-info">
              <span className="cashier-name">{fullName}</span>
            </div>

            <span className="cashier-role-pill">
              <Shield size={11} />
              {role}
            </span>
          </div>

          <div className="cashier-bottom">
            <Store size={14} />
            <span>{user.businessName}</span>
          </div>
        </div>
      )}

      <div className="dash-header-right">
        <span className="dash-header-date">{today}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
