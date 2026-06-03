import React from 'react'
import '../Css/Welcome.css'
import mac from '../assets/Macbook.png'
import phone from '../assets/Iphone.png'

const Welcome = () => {
  return (
    <div className="welcome-section">

      <div className="welcome-header">
        <h1 className="welcome-title-black">
           MANAGE YOUR SUPERMARKET INVENTORY & {' '}
          <span className="welcome-title-blue">TRACK EXPIRY PRODUCTS WITH THE BEST SOFTWARE</span>
        </h1>
     </div>

      <div className="welcome-devices">
        <div className="welcome-laptop">
          <img
            src={mac}
            alt="Inventra Dashboard Laptop"
            className="welcome-laptop-img"
          />
        </div>
        <div className="welcome-phone">
          <img
            src={phone}
            alt="Inventra Dashboard Phone"
            className="welcome-phone-img"
          />
        </div>
      </div>

    </div>
  )
}

export default Welcome