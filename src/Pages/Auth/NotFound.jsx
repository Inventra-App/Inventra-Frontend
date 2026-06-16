import React from 'react'
import { ChevronLeft, Home, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Css/ErrorPages.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-art">
          <div className="notfound-stars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h1>404</h1>
          <Rocket className="notfound-rocket" size={54} />
        </div>

        <h2>Page not found</h2>
        <p>
          Oops! The page you're looking for doesn't exist or
          <br />
          may have been moved.
        </p>

        <div className="notfound-actions">
          <button className="notfound-back-btn" type="button" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
            <span>Go back</span>
          </button>
          <button className="notfound-dashboard-btn" type="button" onClick={() => navigate('/dashboard')}>
            <Home size={15} />
            <span>Go to Dashboard</span>
          </button>
        </div>

        <span className="notfound-code">Error code: 404 - Page Not Found</span>
      </div>
    </div>
  )
}

export default NotFound
