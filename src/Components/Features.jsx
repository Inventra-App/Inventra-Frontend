import React from "react";
import "../Css/Features.css";
import {
  Package,
  Calendar,
  ShoppingCart,
  User,
  TrendingUp,
  LayoutDashboard,
  Check,
} from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="features">
      <div className="features-header">
        <span className="features-badge">Features</span>
        <h2>Everything you need to run your store</h2>
        <p>
          Inventra is built to help you take control of your inventory,
          reduce waste, and grow your business.
        </p>
      </div>

      <div className="features-mobile-list">
        <h2>Why Choose Our System?</h2>

        <div className="features-mobile-item">
          <div className="features-check">
            <Check size={20} />
          </div>
          <div>
            <h3>Reduce Product Waste</h3>
            <p>Prevent losses from expired products with automatic expiry tracking and alerts</p>
          </div>
        </div>

        <div className="features-mobile-item">
          <div className="features-check">
            <Check size={20} />
          </div>
          <div>
            <h3>Improve Accuracy</h3>
            <p>Real-time inventory updates ensure you always know exact stock levels</p>
          </div>
        </div>

        <div className="features-mobile-item">
          <div className="features-check">
            <Check size={20} />
          </div>
          <div>
            <h3>Staff Accountability</h3>
            <p>Complete activity logging tracks who did what and when for full transparency</p>
          </div>
        </div>

        <div className="features-mobile-item">
          <div className="features-check">
            <Check size={20} />
          </div>
          <div>
            <h3>Easy to Use</h3>
            <p>Intuitive interface requires minimal training for your team</p>
          </div>
        </div>
      </div>

      <div className="features-grid">

        <div className="feature-card">
          <div className="icon-box purple">
            <Package size={28} />
          </div>

          <h3>Real-time Inventory</h3>
          <p>
            Track stock levels in real time across all categories
            and locations.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-box orange">
            <Calendar size={28} />
          </div>

          <h3>Expiry Management</h3>

          <p>
            Get alerts for products nearing expiry and reduce
            waste & losses.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-box green">
            <ShoppingCart size={28} />
          </div>

          <h3>Sales Tracking</h3>

          <p>
            Monitor sales in real time and view detailed history
            and reports.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-box blue">
            <User size={28} />
          </div>

          <h3>Staff Accountability</h3>

          <p>
            Track employee activities and improve operational
            transparency.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-box red">
            <TrendingUp size={28} />
          </div>

          <h3>Reports & Insights</h3>

          <p>
            Make data-driven decisions with powerful reports
            and analytics.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-box gray">
            <LayoutDashboard size={28} />
          </div>

          <h3>Easy Dashboard</h3>

          <p>
            User-friendly interface designed for supermarket
            operations.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Features;
