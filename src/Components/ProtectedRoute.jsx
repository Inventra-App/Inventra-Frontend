import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getSessionUser } from "../Utils/sessionUser";
import { canAccessPath, getStaffLoginDestination } from "../Utils/authRoles";

const ProtectedRoute = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("inventra_token");
  const sessionUser = getSessionUser();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!accountId) {
    return <Navigate to={`/${sessionUser.accountId}${location.pathname}`} replace />;
  }

  if (accountId !== sessionUser.accountId) {
    const currentPage = location.pathname.replace(/^\/[^/]+/, "") || "/dashboard";
    return <Navigate to={`/${sessionUser.accountId}${currentPage}`} replace />;
  }

  const currentPage = location.pathname.replace(/^\/[^/]+/, "") || "/dashboard";
  if (!canAccessPath(sessionUser.role, currentPage)) {
    return (
      <Navigate
        to={`/${sessionUser.accountId}${getStaffLoginDestination(sessionUser.role)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
