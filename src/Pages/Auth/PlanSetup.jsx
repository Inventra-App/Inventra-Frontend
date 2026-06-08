import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../Components/Header'
import userIcon from '../../assets/userIcon.png'
import starIcon from '../../assets/starIcon.png'
import envelopeIcon from '../../assets/envelopeIcon.png'
import padlockIcon from '../../assets/PadlockIcon.png'
import shieldCheckIcon from '../../assets/shieldCheckIcon.png'
import headphoneIcon from '../../assets/HeadphonemicIcon.png'
import './Css/PlanSetup.css'

const PlanSetup = () => {
  const { plan } = useParams()
  const navigate = useNavigate()
  const isPremium = plan === 'premium'
  const planName = isPremium ? 'Premium Plan' : 'Standard Plan'
  const planPrice = isPremium ? '₦ 70,000/month' : '₦ 25,000/month'
  const totalPrice = isPremium ? '₦ 70,000' : '₦ 25,000'

  const includes = [
    'Up to 5,000 products',
    'Advance Inventory Management',
    'Smart expiry management',
    'Smart expiry management',
    'POS and sales management',
    'Low stock alerts',
    'Reports and analytics',
    isPremium ? 'Unlimited staffs account' : 'Up to 5 staffs account',
    'Priority email support',
    isPremium ? 'Access to premium tools' : 'Access to standard tools',
  ]

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
                  <select>
                    <option>🇳🇬 + 234</option>
                  </select>
                  <input type='text' defaultValue='81657788' />
                </div>
              </label>

              <label>
                Business Email
                <input type='email' placeholder='Enter your business email' />
              </label>

              <label>
                Business Type
                <input type='text' placeholder='Enter your business email' />
              </label>
            </div>
          </div>

          <div className='plan-form-section'>
            <div className='plan-section-title'>
              <span><img src={userIcon} alt='' /></span>
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
              <span><img src={userIcon} alt='' /></span>
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
            <button type='button' className='plan-back-btn' onClick={() => navigate('/pricing')}>← Back</button>
            <button type='button' className='plan-continue-btn'>Continue →</button>
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
                <li key={item}>✓ {item}</li>
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
                <p>You won’t be charged until your trial ends</p>
              </div>
            </div>
          </section>

          <section className='plan-help-card'>
            <img src={headphoneIcon} alt='' />
            <div>
              <h3>Need Help Choosing?</h3>
              <p>Our team is here to help you choose the right plan</p>
              <a href='/contact'>Chat with sales →</a>
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
            <p>we’re here to help you succeed</p>
          </div>
        </article>
      </section>
    </main>
  )
}

export default PlanSetup
