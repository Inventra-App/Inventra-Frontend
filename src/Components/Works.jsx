import React from 'react'
import '../Css/Works.css'

const steps = [
  {
    number: 1,
    title: 'Add Products',
    desc: 'Create product entries in the system',
    color: '#4f46e5',
    dots: ['#4f46e5', '#4f46e5', '#4f46e5'],
  },
  {
    number: 2,
    title: 'Receive Stock',
    desc: 'Record incoming goods with batch numbers',
    color: '#16a34a',
    dots: ['#16a34a', '#16a34a', '#16a34a'],
  },
  {
    number: 3,
    title: 'Process Sales',
    desc: 'Sell products using POS system',
    color: '#1e293b',
    dots: ['#e5c99b', '#1e293b', '#e5c99b'],
  },
  {
    number: 4,
    title: 'Monitor Expiry',
    desc: 'Track and act on expiry alerts',
    color: '#e5a84a',
    dots: null,
  },
]

const Works = () => {
  return (
    <div className="works-section">

      <h2 className="works-title">How it works?</h2>
      <div className="works-steps">
        {steps.map((step, index) => (
          <div key={index} className="works-step-wrapper">
            <div className="works-step">
              <div className="works-circle" style={{ backgroundColor: step.color }}>
                {step.number}
              </div>
              <h4 className="works-step-title">{step.title}</h4>
              <p className="works-step-desc">{step.desc}</p>
            </div>

            {step.dots && (
              <div className="works-dots">
                {step.dots.map((dotColor, i) => (
                  <span key={i} className="works-dot" style={{ backgroundColor: dotColor }}></span>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default Works