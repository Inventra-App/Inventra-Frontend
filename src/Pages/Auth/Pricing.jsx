import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Pricing.css";
import Header from "../../Components/Header";
import markCheck from "../../assets/markCheck.png";
import markcheckWhite from "../../assets/markcheckWhite.png";
import clockIcon from "../../assets/clockIcon.png";
import paymentIcon from "../../assets/PaymentIcon.png";
import receiptIcon from "../../assets/receiptIcon.png";
import headphoneIcon from "../../assets/HeadphoneIcon.png";
import pricingPageCTA from "../../assets/PricingpageCTA.png";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();
  const isYearly = billingCycle === "yearly";
  const toggleBillingCycle = () => {
    setBillingCycle((currentCycle) =>
      currentCycle === "yearly" ? "monthly" : "yearly",
    );
  };

  const freeFeatures = [
    "Real-time inventory tracking",
    "Basic stock tracking",
    "Sales tracking",
    "Up to 100 products",
    "Email support",
    "Basic reporting",
    "Single user access",
  ];

  const standardFeatures = [
    "Everything in free tier, plus:",
    "Unlimited products",
    "Advanced inventory management",
    "Expiry date tracking",
    "Low stock alerts",
    "Multiple users (up to 5)",
    "Advanced analytics",
    "Priority email support",
    "Custom reports",
    "API access",
  ];

  const premiumFeatures = [
    "Unlimited users",
    "Advanced analytics",
    "Custom integrations",
    "Dedicated account manager",
    "Phone support",
    "Custom training",
    "Advanced security",
    "SLA guarantee",
    "White-label options",
    "Custom development",
  ];

  const pricingBenefits = [
    {
      title: "14 - Day Free Trial",
      text: "Explore all core features risk- free\nNo credit card required",
      icon: clockIcon,
      color: "purple",
    },
    {
      title: "Flexibie Payment",
      text: "Multple payment options",
      icon: paymentIcon,
      color: "green",
    },
    {
      title: "Secure & Trusted",
      text: "Your data is protected with\nindustry standard security",
      icon: receiptIcon,
      color: "blue",
    },
    {
      title: "Support you can rely on",
      text: "Our support team is always here\nto help you succeed",
      icon: headphoneIcon,
      color: "orange",
    },
  ];

  return (
    <>
      <main className="pricing-Page">
        <Header />
        <article className="pricing_plansHeader">
          <nav className="plans_container">
            <div className="cont_title">Pricng Plans</div>
            <nav className="texts">
              <p className="bold_text">Simple Pricing for Smarter Inventory Management</p>
              <p className="sub_text">Choose a plan that fits your business operation and scale as your store grows</p>
            </nav>
          </nav>
        </article>
        <section className="pricing_interface">
          <div className="billing_toggle" aria-label="Billing cycle">
            <button
              className={`billing_option ${!isYearly ? "billing_option_active" : ""}`}
              type="button"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`billing_option ${isYearly ? "billing_option_active" : ""}`}
              type="button"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </button>
          </div>

          <div className="pricing_cards">
            <article className="pricing_card">
              <div>
                <h2>Free for 14 days</h2>
                <p className="plan_caption">Try before committing</p>
                <div className="plan_price">
                  N0 <span>/Per Month</span>
                </div>
                <ul className="plan_features">
                  {freeFeatures.map((feature) => (
                    <li key={feature}>
                      <img className="check_mark" src={markCheck} alt="" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="plan_btn" type="button" onClick={toggleBillingCycle}>
                Get Free Trial
              </button>
            </article>

            <article className="pricing_card pricing_card_featured">
              <span className="popular_badge">MOST POPULAR</span>
              <div>
                <h2>Standard</h2>
                <p className="plan_caption">For small to medium business</p>
                <div className="plan_price">
                  N{isYearly ? "300,000" : "25,000"} <span>/{isYearly ? "Yearly" : "Monthly"}</span>
                </div>
                <ul className="plan_features">
                  {standardFeatures.map((feature) => (
                    <li key={feature}>
                      <img className="check_mark" src={markcheckWhite} alt="" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="plan_btn plan_btn_featured" type="button" onClick={() => navigate("/plan-setup/standard")}>
                Start with Standard Plan
              </button>
            </article>

            <article className="pricing_card">
              <div>
                <h2>Premium</h2>
                <p className="plan_caption">Everything in standard, plus:</p>
                <div className="plan_price">
                  N{isYearly ? "840,000" : "70,000"} <span>/{isYearly ? "Yearly" : "Monthly"}</span>
                </div>
                <ul className="plan_features">
                  {premiumFeatures.map((feature) => (
                    <li key={feature}>
                      <img className="check_mark" src={markCheck} alt="" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="plan_btn" type="button" onClick={() => navigate("/plan-setup/premium")}>
                Start with Premium Plan
              </button>
            </article>
          </div>
        </section>


        
        <section className="pricing_benefits" aria-label="Pricing benefits">
          {pricingBenefits.map((benefit) => (
            <article className="pricing_benefit" key={benefit.title}>
              <div className={`benefit_icon benefit_icon_${benefit.color}`}>
                <img src={benefit.icon} alt="" />
              </div>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          className="pricing_cta"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.68)), url(${pricingPageCTA})` }}
        >
          <h2>Not sure which plan is right for you?</h2>
          <p>Start with our 14-day free trial and explore all features. No credit card required.</p>
          <button type="button" onClick={() => navigate("/signup")}>Get Started Now</button>
        </section>
      </main>
    </>
  );
};

export default Pricing;
