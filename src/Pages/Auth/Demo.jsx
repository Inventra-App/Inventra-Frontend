import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import './Css/Demo.css'

const Demo = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Demo booked:', formData)
  }

  return (
    <div className="demo-page-container">
      <div className="demo-card">
        <h1 className="demo-title">BOOK A DEMO</h1>
        
        <form onSubmit={handleSubmit} className="demo-form">
          <div className="demo-input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Anthony"
              value={formData.name}
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
              placeholder="aonyema512@@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="demo-input-group">
            <label htmlFor="notes">Add a Note</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Leave a message....."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="demo-submit-btn">
            Book a Demo
          </button>
        </form>

        <button 
          type="button" 
          className="demo-back-home" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  )
}

export default Demo