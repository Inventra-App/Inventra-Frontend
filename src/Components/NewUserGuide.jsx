import React from "react";
import { Package, Plus, Sparkles, Tags, X, Layers } from "lucide-react";
import "../Css/NewUserGuide.css";

const steps = [
  {
    number: 1,
    icon: <Tags size={18} />,
    title: "Create a category",
    text: "Group your products (e.g. Dairy, Beverages)",
  },
  {
    number: 2,
    icon: <Package size={18} />,
    title: "Add products",
    text: "Add items with price and the rest",
  },
  {
    number: 3,
    icon: <Layers size={18} />,
    title: "Manage stock",
    text: "Restock, move to Available,",
  },
];

const NewUserGuide = ({ onClose, onCreateCategory, onAddProduct }) => {
  return (
    <section className="new-user-guide">
      <button
        type="button"
        className="new-user-close"
        onClick={onClose}
        aria-label="Close new user guide"
      >
        <X size={18} />
      </button>

      <div className="new-user-heading">
        <span className="new-user-sparkle">
          <Sparkles size={22} />
        </span>
        <div>
          <h3>Welcome to Inventory Management</h3>
          <p>Follow these 3 steps to get your store set up</p>
        </div>
      </div>

      <div className="new-user-steps">
        {steps.map((step) => (
          <div className="new-user-step" key={step.number}>
            <div className="new-user-step-icons">
              <span className="new-user-number">{step.number}</span>
              <span className="new-user-icon">{step.icon}</span>
            </div>
            <h4>{step.title}</h4>
            <p>{step.text}</p>
          </div>
        ))}
      </div>

      <div className="new-user-actions">
        <button
          type="button"
          className="new-user-primary"
          onClick={onCreateCategory}
        >
          <Tags size={18} />
          Create First Category
        </button>

        <button
          type="button"
          className="new-user-secondary"
          onClick={onAddProduct}
        >
          <Plus size={18} />
          Add a Product
        </button>
      </div>
    </section>
  );
};

export default NewUserGuide;
