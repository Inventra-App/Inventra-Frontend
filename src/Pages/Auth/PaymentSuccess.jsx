import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Css/PaymentSuccess.css'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/dashboard')
      return
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, navigate])

  return (
    <main className='payment-success-page'>
      <section className='payment-success-card'>
        <div className='payment-success-check'>
          <svg width='40' height='40' viewBox='0 0 24 24' fill='none'>
            <path d='M5 12.5L10 17.5L19 7.5' stroke='#00bf63' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </div>

        <h1>Payment Successful!</h1>
        <p className='payment-success-subtext'>
          Welcome to Inventra Professional! Your<br />account has been upgraded.
        </p>

        <div className='payment-success-email-box'>
          A confirmation email has been sent to
        </div>

        <button
          type='button'
          className='payment-success-btn'
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>

        <p className='payment-success-redirect'>
          Redirecting automatically in {countdown} seconds...
        </p>
      </section>
    </main>
  )
}

export default PaymentSuccess
