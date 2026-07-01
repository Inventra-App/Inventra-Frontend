import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import "../Pages/Auth/Css/Dashboard.css";
import SideBar from "./SideBar";
import DashboardHeader from "./DashboardHeader";
import Logo from "./Logo";
import { logoutUser } from "../API/logoutUser";
import NoInternet from "../Pages/Auth/NoInternet";
import { getLoginPathForRole } from "../Utils/authRoles";
import { getSessionUser } from "../Utils/sessionUser";
import { getUserProfile } from "../API/userProfileApi";
import { getSingleStaff } from "../API/userManagementAPI";
import { setAccessToken } from "../redux/apiSlice";
import { persistUserProfile } from "../Utils/userProfileState";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const showOfflinePage = () => setIsOffline(true);
    const hideOfflinePage = () => setIsOffline(false);

    window.addEventListener("offline", showOfflinePage);
    window.addEventListener("online", hideOfflinePage);

    return () => {
      window.removeEventListener("offline", showOfflinePage);
      window.removeEventListener("online", hideOfflinePage);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAuthenticatedProfile = async () => {
      const token = sessionStorage.getItem("inventra_token");
      if (!token) return;

      dispatch(setAccessToken(token));

      const sessionUser = getSessionUser();

      const role = String(sessionUser.role || "").toLowerCase();

      try {
        let profile;

        if (role === "admin") {
          profile = await getUserProfile();
        } else {
          profile = await getSingleStaff(sessionUser.id);
        }

        if (isMounted) {
          persistUserProfile(profile, dispatch);
        }
      } catch (error) {
        console.error("Profile refresh failed:", error);
      }
    };

    loadAuthenticatedProfile();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openLogoutModal = () => {
    closeMobileMenu();
    setIsLogoutModalOpen(true);
  };
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const confirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const sessionUser = getSessionUser();
    const role = String(sessionUser?.role || "").toLowerCase();
    const tenant = sessionStorage.getItem("tenant");

    let loginPath = getLoginPathForRole(role);

    if (tenant) {
      if (role === "manager") {
        loginPath = `/staff-login?tenant=${tenant}`;
      } else if (role === "cashier") {
        loginPath = `/cashier-login?tenant=${tenant}`;
      }
    }

    try {
      await logoutUser();
      toast.success("You've been logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.success("Logged out locally (server was unreachable).");
    } finally {
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate(loginPath, { replace: true });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="desktop-sidebar-wrapper">
        <SideBar onItemClick={() => {}} onLogout={openLogoutModal} />
      </div>

      <div
        className={`mobile-navigation-bar ${isMobileMenuOpen ? "nav-hidden-state" : ""}`}
      >
        <div className="mobile-brand-emblem">
          <Logo variant="dark" />
        </div>
        <button
          className="mobile-hamburger-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`mobile-sidebar-backdrop ${isMobileMenuOpen ? "backdrop-active" : ""}`}
        onClick={closeMobileMenu}
      />
      <div
        className={`mobile-sidebar-drawer ${isMobileMenuOpen ? "drawer-active" : ""}`}
      >
        <button className="mobile-drawer-close" onClick={closeMobileMenu}>
          ×
        </button>
        <SideBar onItemClick={closeMobileMenu} onLogout={openLogoutModal} />
      </div>

      <div className="dashboard-main">
        <div className="desktop-header-wrapper">
          <DashboardHeader />
        </div>
        {isOffline ? <NoInternet /> : <Outlet />}
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal-backdrop" role="presentation">
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="logout-modal-icon">
              <LogOut size={28} />
            </div>

            <h2 id="logout-modal-title">Log out Account ?</h2>
            <p>Are you sure you want to logout your account ?</p>

            <div className="logout-modal-actions">
              <button
                className="logout-cancel-btn"
                type="button"
                onClick={closeLogoutModal}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                className="logout-confirm-btn"
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={17} />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
