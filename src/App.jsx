import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LandingPage from "./Pages/Auth/LandingPage";
import Pricing from "./Pages/Auth/Pricing";
import AboutUs from "./Pages/Auth/AboutUs";
import ContactUs from "./Pages/Auth/ContactUs";
import SignUp from "./Pages/Auth/SignUp";
import Login from "./Pages/Auth/Login";
import SignUpVerify from "./Pages/Auth/SignUpVerify";
import SupermarketInfo from "./Pages/Auth/SupermarketInfo";
import SettingUp from "./Pages/Auth/SettingUp";
import Created from "./Pages/Auth/Created";
import ForgetPassUi from "./Components/ForgetPassUi";
import DashboardLayout from "./Components/DashboardLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Pages/Auth/Dashboard";
import Inventory from "./Pages/Auth/Inventory";
import Sales from "./Pages/Auth/Sales";
import ExpiryMgm from "./Pages/Auth/ExpiryMgm";
import ActivityLog from "./Pages/Auth/ActivityLog";
import UserMgm from "./Pages/Auth/UserMgm";
import Settings from "./Pages/Auth/Settings";
import Demo from "./Pages/Auth/Demo";
import UserManagementInfo from "./Pages/Auth/UserManagementInfo";
import PlanSetup from "./Pages/Auth/PlanSetup";
import PaymentSuccess from "./Pages/Auth/PaymentSuccess";
import CategoriesList from "./Pages/Auth/CategoriesList";
import NotFound from "./Pages/Auth/NotFound";
import StaffLogin from "./Components/StaffLogin";
import CashierLogin from "./Components/CashierLogin";

import PublicAnimationLayout from "./Components/PublicAnimationLayout";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicAnimationLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/cashier-login" element={<CashierLogin />} />
          <Route path="/signupverify" element={<SignUpVerify />} />
          <Route path="/supermarket-info" element={<SupermarketInfo />} />
          <Route path="/setting-up" element={<SettingUp />} />
          <Route path="/created" element={<Created />} />
          <Route path="/resetpassword" element={<ForgetPassUi />} />
          <Route path="/forgot-password" element={<ForgetPassUi />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/user-management-info" element={<UserManagementInfo />} />
          <Route path="/plan-setup/:plan" element={<PlanSetup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/categories" element={<CategoriesList />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expiry" element={<ExpiryMgm />} />
            <Route path="/activity" element={<ActivityLog />} />
            <Route path="/users" element={<UserMgm />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/:accountId" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/categories" element={<CategoriesList />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expiry" element={<ExpiryMgm />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="users" element={<UserMgm />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
