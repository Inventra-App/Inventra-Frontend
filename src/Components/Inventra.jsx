import React from 'react'
import '../Css/Inventra.css'
import supermarket from '../assets/Supermarket1.jpg'
import warehouse from '../assets/Warehouse.jpg'
import pharmacy from '../assets/Pharmacy.jpg'
import retail from '../assets/Retail.jpg'

const Inventra = () => {
  return (
    <div className="inventra-section">

      <h2 className="inventra-title">Who is Inventra For?</h2>
      <p className="inventra-subtitle">
        Inventra is built for businesses that manage inventory, sales, and perishable products daily.
      </p>

      <div className="inventra-grid">
        <div className="inventra-card">
          <img
            src={supermarket}
            alt="Supermarkets"
            className="inventra-card-img"
          />
          <div className="inventra-card-overlay"></div>
          <div className="inventra-card-text">
            <h3>Supermarkets</h3>
            <p>Track inventory, manage sales, reduce expiry losses, <br/> and improve staff accountability</p>
          </div>
        </div>

        <div className="inventra-card">
          <img
            src={warehouse}
            alt="Warehouses"
            className="inventra-card-img"
          />
          <div className="inventra-card-overlay"></div>
          <div className="inventra-card-text">
            <h3>Warehouses</h3>
            <p>Monitor stock movement, manage incoming goods, <br/> and maintain accurate inventory records</p>
          </div>
        </div>

        <div className="inventra-card">
          <img
            src={pharmacy}
            alt="Pharmacies"
            className="inventra-card-img"
          />
          <div className="inventra-card-overlay"></div>
          <div className="inventra-card-text">
            <h3>Pharmacies</h3>
            <p>Track medicine expiry dates, manage stock levels, <br/> and reduce product waste.</p>
          </div>
        </div>

        <div className="inventra-card">
          <img
            src={retail}
            alt="Retail Stores"
            className="inventra-card-img"
          />
          <div className="inventra-card-overlay"></div>
          <div className="inventra-card-text">
            <h3>Retail Stores</h3>
            <p>Handles products sales, inventory updates, and low stock <br/> alerts in real time</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Inventra