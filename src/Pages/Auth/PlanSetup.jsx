import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../Components/Header'
import userIcon from '../../assets/userIcon.png'
import starIcon from '../../assets/starIcon.png'
import envelopeIcon from '../../assets/envelopeIcon.png'
import padlockIcon from '../../assets/PadlockIcon.png'
import shieldCheckIcon from '../../assets/shieldCheckIcon.png'
import headphoneIcon from '../../assets/HeadphonemicIcon.png'
import NigeriaFlag from '../../assets/NigeriaFlag.png'
import { GoCheckCircleFill } from "react-icons/go";
import { LuCreditCard } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import completePaymentIcon from '../../assets/completePaymentIcon.png'
import locationIcon from '../../assets/LocationIcon.png'
import paymentLockIcon from '../../assets/PaymentIcon.png'
import './Css/PlanSetup.css'

const PlanSetup = () => {
  const { plan } = useParams()
  const navigate = useNavigate()
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const isPremium = plan === 'premium'
  const planName = isPremium ? 'Premium Plan' : 'Professional Plan'
  const planPrice = isPremium ? 'N70000/month' : 'N25000/month'
  const planAmount = isPremium ? 70000 : 25000
  const taxAmount = isPremium ? 7000 : 2500
  const totalPrice = `N${planAmount}`
  const totalDue = `N${planAmount + taxAmount}`

  const includes = [
    'Up to 5,000 products',
    'Advance Inventory Management',
    'Smart expiry management',
    'POS and sales management',
    'Low stock alerts',
    'Reports and analytics',
    isPremium ? 'Unlimited staffs account' : 'Up to 5 staffs account',
    'Priority email support',
    isPremium ? 'Access to premium tools' : 'Access to standard tools',
  ]

  const checkoutIncludes = [
    '14-day free trial',
    'Cancel anytime',
    'Full access to all features',
    'Priority customer support',
  ]

  if (showPayment) {
    return (
      <main className='payment-page'>
        <header className='payment-header'>
          <button type='button' onClick={() => setShowPayment(false)}>Back to Pricing</button>
          <div className='payment-divider'></div>
          <h1>Complete Your Purchase</h1>
          <div className='payment-secure'>
            <img src={shieldCheckIcon} alt='' />
            <span>Secure Checkout</span>
          </div>
        </header>

        <div className='payment-container'>
          <section className='payment-main'>
            <div className='payment-card payment-method-card'>
              <h2>Select Payment Method</h2>
              <div className='payment-methods'>
                <button
                  type='button'
                  className={`payment-method ${paymentMethod === 'card' ? 'payment-method-active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span className='payment-method-icon'><div className="creditCard"><LuCreditCard /></div></span>
                  <div>
                    <strong>Credit/Debit Card</strong>
                    <small>Visa, Mastercard, Verve</small>
                  </div>
                  {paymentMethod === 'card' && <b><div className='circlefil'><GoCheckCircleFill /></div></b>}
                </button>

                <button
                  type='button'
                  className={`payment-method ${paymentMethod === 'korapay' ? 'payment-method-active' : ''}`}
                  onClick={() => setPaymentMethod('korapay')}
                >
                  <span className='payment-method-icon'><img src={completePaymentIcon} alt='' /></span>
                  <div>
                    <strong>Korapay</strong>
                    <small>Bank transfer, USSD, QR</small>
                  </div>
                  {paymentMethod === 'korapay' && <b><div className='circlefil'><GoCheckCircleFill /></div></b>}
                </button>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <div className='payment-card payment-form-card'>
                <div className='payment-section-title'>
                  <span><div className="creditCard" style={{fontSize:"20px", color:"blue"}}><LuCreditCard /></div></span>
                  <div>
                    <h2>Card Information</h2>
                    <p>Enter your card details</p>
                  </div>
                </div>

                <label>Card Number<input type='text' placeholder='1234 5678 9012 3456' /></label>
                <label>Cardholder Name<input type='text' placeholder='John Doe' /></label>
                <div className='payment-two-cols'>
                  <label>Expiry Date<input type='text' placeholder='MM/YY' /></label>
                  <label>CVV<input type='text' placeholder='123' /></label>
                </div>
              </div>
            ) : (
              <div className='korapay-panel'>
                <div className='payment-section-title'>
                  <span><img src={completePaymentIcon} alt='' /></span>
                  <div>
                    <h2>Pay with Korapay</h2>
                    <p>Fast and secure payment gateway</p>
                  </div>
                </div>

                <div className='korapay-info'>
                  <div><img src={shieldCheckIcon} alt='' /></div>
                  <section>
                    <h3>Secure Payment via Korapay</h3>
                    <p>You'll be redirected to Korapay's secure payment page to complete your transaction.</p>
                    <strong>Available payment options:</strong>
                    <span>✓ Bank Transfer</span>
                    <span>✓ USSD Code</span>
                    <span>✓ QR Code Scan</span>
                    <span>✓ Card Payment</span>
                  </section>
                </div>

                <label>Email Address<input type='email' placeholder='john@example.com' /></label>
                <small>Receipt and payment confirmation will be sent to this email</small>
              </div>
            )}

            <div className='payment-card payment-form-card'>
              <div className='payment-section-title'>
                <span><img src={locationIcon} alt='' /></span>
                <div>
                  <h2>Billing Information</h2>
                  <p>Where should we send the invoice?</p>
                </div>
              </div>

              <label>Email Address<input type='email' placeholder='john@example.com' /></label>
              <label>Billing Address<input type='text' placeholder='123 Main Street' /></label>
              <div className='payment-two-cols'>
                <label>City<input type='text' placeholder='Lagos' /></label>
                <label>ZIP Code<input type='text' placeholder='10001' /></label>
              </div>
              <label>Country<input type='text' placeholder='Nigeria' /></label>
            </div>

            <div className='payment-lock-box'>
              <img src={paymentLockIcon} alt='' />
              <div>
                <strong>Secure Payment</strong>
                <p>Your payment information is encrypted and secure. We never store your card details.</p>
              </div>
            </div>
          </section>

          <aside className='payment-summary'>
            <h2>Order Summary</h2>
            <div className='payment-plan-row'>
              <div>
                <strong>{planName}</strong>
                <span>Billed monthly</span>
              </div>
              <b>{totalPrice}</b>
            </div>

            <div className='payment-summary-lines'>
              <div><span>Subtotal</span><strong>{totalPrice}</strong></div>
              <div><span>Tax (10%)</span><strong>N{taxAmount}</strong></div>
            </div>

            <div className='payment-total-row'>
              <strong>Total Due Today</strong>
              <b>{totalDue}</b>
            </div>

            <div className='payment-included'>
              <h3>What's included:</h3>
              {checkoutIncludes.map((item) => <p key={item}>{item}</p>)}
            </div>

            <button type='button' className='payment-complete-btn' onClick={() => navigate('/payment-success')}>
              <img src={paymentLockIcon} alt='' />
              {paymentMethod === 'korapay' ? `Pay with Korapay - ${totalDue}` : `Complete Payment - ${totalDue}`}
            </button>

            <p className='payment-terms'>By completing this purchase, you agree to our <a href='/terms'>Terms of Service</a> and <a href='/privacy'>Privacy Policy</a></p>
          </aside>
        </div>
      </main>
    )
  }

  return (
    <main className='plan-page'>
      <Header />

      <div className='plan-container'>
        <section className='plan-form-card'>
          <h1>You Selected: <span>{planName}</span></h1>
          <p>Customize your plan to fit your business needs.</p>

          <div className='plan-form-section'>
            <div className='plan-section-title'>
              <span><img src={userIcon} alt='' /></span>
              <div>
                <h2>Business Information</h2>
                <p>Tell us about your business</p>
              </div>
            </div>

            <div className='plan-form-grid'>
              <label>
                Business Name
                <input type='text' placeholder='Enter your business name' />
              </label>

              <label>
                Business Phone Number
                <div className='plan-phone-row'>
                  <div className='plan-country-code'>
                    <img src={NigeriaFlag} alt='' />
                    <span>+234</span>
                  </div>
                  <input  type='text' placeholder='0000000000' />
                </div>
              </label>

              <label>
                Business Email
                <input type='email' placeholder='Enter your business email' />
              </label>

              <label>
                Business Type
                <input type='text' placeholder='Enter your business type' />
              </label>
            </div>
          </div>

          <div className='plan-form-section'>
            <div className='plan-section-title'>
              <span><img src={userIcon} alt="" /></span>
              <div>
                <h2>Team & Users</h2>
                <p>Add Staff Users to get Started</p>
              </div>
            </div>

            <div className='plan-count-row'>
              <label>
                Number of Staff Users
                <div className='plan-counter'>
                  <button type='button'>-</button>
                  <span>5 Users</span>
                  <button type='button'>+</button>
                </div>
              </label>

              <div className='plan-note'>
                <strong>Need More Users?</strong>
                <p>You can add more staff users anytime from your dashboard</p>
              </div>
            </div>
          </div>

          <div className='plan-form-section'>
            <div className='plan-section-title'>
              <span><img src={locationIcon} alt='' /></span>
              <div>
                <h2>Business Branches(optional)</h2>
                <p>Add additional branches if you have more than one location</p>
              </div>
            </div>

            <div className='plan-count-row'>
              <label>
                Number of Branches
                <div className='plan-counter'>
                  <button type='button'>-</button>
                  <span>1 Branch</span>
                  <button type='button'>+</button>
                </div>
              </label>

              <div className='plan-note plan-note-light'>
                <p>Manage multiple branches in the business plan.</p>
              </div>
            </div>
          </div>

          <div className='plan-actions'>
            <button type='button' className='plan-back-btn' onClick={() => navigate('/pricing')}>Back</button>
            <button type='button' className='plan-continue-btn' onClick={() => setShowPayment(true)}>Continue</button>
          </div>
        </section>

        <aside className='plan-side'>
          <section className='plan-summary-card'>
            <h2>Plan Summary</h2>

            <div className='plan-summary-head'>
              <span><img src={starIcon} alt='' /></span>
              <div>
                <h3>{planName}</h3>
                <strong>{planPrice}</strong>
                <p>Everything you need to manage your supermarket efficiently.</p>
              </div>
            </div>

            <p className='plan-include-title'>Includes:</p>
            <ul>
              {includes.map((item) => (
                <li key={item}><div className="circlecheck"><  FaRegCircleCheck /></div> {item}</li>
              ))}
            </ul>

            <div className='plan-price-box'>
              <div><span>Monthly Price</span><strong>{totalPrice}</strong></div>
              <div><span>Staff Users(5)</span><strong>Included</strong></div>
              <div><span>Additional Branches(1)</span><strong>Included</strong></div>
            </div>

            <div className='plan-total-row'>
              <strong>Total</strong>
              <span>{totalPrice}</span>
            </div>

            <div className='plan-trial'>
              <img src={shieldCheckIcon} alt='' />
              <div>
                <strong>14 Day Free Trial</strong>
                <p>You won't be charged until your trial ends</p>
              </div>
            </div>
          </section>

          <section className='plan-help-card'>
            <img src={headphoneIcon} alt='' />
            <div>
              <h3>Need Help Choosing?</h3>
              <p>Our team is here to help you choose the right plan</p>
              <a href='/contact'>Chat with sales</a>
            </div>
          </section>
        </aside>
      </div>

      <section className='plan-bottom-benefits'>
        <article>
          <span><img src={envelopeIcon} alt='' /></span>
          <div>
            <h3>No Credit Card Required</h3>
            <p>Start your 14 day free trial</p>
          </div>
        </article>

        <article>
          <span><img src={padlockIcon} alt='' /></span>
          <div>
            <h3>Cancel Anytime</h3>
            <p>You can cancel or change anytime</p>
          </div>
        </article>

        <article>
          <span><img src={shieldCheckIcon} alt='' /></span>
          <div>
            <h3>Secure and Trusted</h3>
            <p>Your data is 100% secured</p>
          </div>
        </article>

        <article>
          <span><img src={headphoneIcon} alt='' /></span>
          <div>
            <h3>24/7 support</h3>
            <p>we're here to help you succeed</p>
          </div>
        </article>
      </section>
    </main>
  )
}

export default PlanSetup
