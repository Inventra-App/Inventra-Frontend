import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import Dashboard from "./Pages/Auth/Dashboard";
import Inventory from "./Pages/Auth/Inventory";
import Sales from "./Pages/Auth/Sales";
import ExpiryMgm from "./Pages/Auth/ExpiryMgm";
import ActivityLog from "./Pages/Auth/ActivityLog";
import UserMgm from "./Pages/Auth/UserMgm";
import Settings from "./Pages/Auth/Settings";
import Demo from "./Pages/Auth/Demo";
import PlanSetup from "./Pages/Auth/PlanSetup";
import PaymentSuccess from "./Pages/Auth/PaymentSuccess";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const AnimatedRoutes = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y2: -15 }}
      >
        <Routes location={location}>{children}</Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <AnimatedRoutes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signupverify" element={<SignUpVerify />} />
        <Route path="/supermarket-info" element={<SupermarketInfo />} />
        <Route path="/setting-up" element={<SettingUp />} />
        <Route path="/created" element={<Created />} />
        <Route path="/resetpassword" element={<ForgetPassUi />} />
        <Route path="/forgot-password" element={<ForgetPassUi />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/plan-setup/:plan" element={<PlanSetup />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={null} />
      </AnimatedRoutes>

      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/expiry" element={<ExpiryMgm />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/users" element={<UserMgm />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={null} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
