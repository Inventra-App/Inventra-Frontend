import React, { useState } from "react";
import "../Css/Manage.css";

import Img1 from "../assets/Ellipse 9.png";
import Img2 from "../assets/Ellipse 8.png";
import Img3 from "../assets/Slide 3.jpg";
import Img4 from "../assets/Slide 4.jpg";

const Manage = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="manage-section">
      <div className="manage-left">
        <h1 className="manage-heading">
          Manage your Inventory <span>faster</span>
        </h1>
        <div className="manage-orange"></div>
      </div>

      <div
        className="manage-right"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Unified container that anchors the circles to each other */}
        <div className="manage-images-inner">
          <div
            className={`manage-circle left-current ${
              hovered ? "left-slide" : ""
            }`}
          >
            <img src={Img1} alt="Current left" />
          </div>

          <div
            className={`manage-circle right-current ${
              hovered ? "right-fade" : ""
            }`}
          >
            <img src={Img2} alt="Current right" />
          </div>

          <div
            className={`manage-circle left-new ${
              hovered ? "show-new" : ""
            }`}
          >
            <img src={Img3} alt="New left" />
          </div>

          <div
            className={`manage-circle right-new ${
              hovered ? "show-new" : ""
            }`}
          >
            <img src={Img4} alt="New right" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manage;