import React from 'react'
import { CheckCircle } from 'lucide-react'
import '../Css/StandsOut.css'
import stand from '../assets/Stands Out.png'

const features = [
  'Real-time inventory tracking',
  'Smart expiry alerts',
  'Sales and inventory in one platform',
  'Staff accountability system',
  'Easy-to-use operational dashboard',
  'Built for supermarkets, warehouse and retail businesses',
]

const StandsOut = () => {
  return (
    <div className="standsout-section">

      <div className="standsout-text">
        <h2 className="standsout-title">Why Inventra Stands Out</h2>
        <p className="standsout-desc">
          Inventra is not just an inventory tool - it is a smart operational system designed to help supermarkets
        </p>

        <ul className="standsout-list">
          {features.map((feature, index) => (
            <li key={index} className="standsout-item">
              <CheckCircle className="standsout-icon" size={22} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="standsout-image">
        <img
          src={stand}
          alt="Inventra in action"
          className="standsout-img"
        />
      </div>

    </div>
  )
}

export default StandsOut