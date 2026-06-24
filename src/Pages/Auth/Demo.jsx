import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { bookDemo } from "../../API/inventoryApi";
import "./Css/Demo.css";

const Demo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        firstName: formData.firstName,
        email: formData.email,
        message: formData.message,
      };

      console.log("BOOK DEMO PAYLOAD:", payload);

      const response = await bookDemo(payload);

      setSuccess(response?.message || "Demo request submitted successfully.");

      setFormData({
        firstName: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to submit demo request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-page-container">
      <div className="demo-card">
        <h1 className="demo-title">BOOK A DEMO</h1>

        <form onSubmit={handleSubmit} className="demo-form">
          <div className="demo-input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Anthony"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="demo-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="aonyema512@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="demo-input-group">
            <label htmlFor="notes">Add a Note</label>
            <textarea
              id="message"
              name="message"
              placeholder="Leave a message..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {success && <p className="demo-success">{success}</p>}
          {error && <p className="demo-error">{error}</p>}

          <button type="submit" className="demo-submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Book a Demo"}
          </button>
        </form>

        <button
          type="button"
          className="demo-back-home"
          onClick={() => navigate("/")}
        >
          <ChevronLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Demo;
