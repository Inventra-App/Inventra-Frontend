import React from 'react'
import faqImage from '../assets/faq.png'
import '../Css/Freq.css'

const Freq = () => {
  return (
    <div className="freq-section">

      <div className="freq-left">
        <h2 className="freq-title">Frequently Asked <br /> Questions</h2>
        <p className="freq-desc">
          Find answer's to the most common questions about Inventra, <br />
          Our features, pricing, and how we help supermarkets.
        </p>
      </div>

      <div className="freq-right">
        <img src={faqImage} alt="FAQ" className="freq-img" />
      </div>

    </div>
  )
}

export default Freq