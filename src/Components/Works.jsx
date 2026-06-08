import React from 'react'
import '../Css/Works.css'

const steps = [
  {
    number: 1,
    title: 'Add Products',
    desc: 'Create product entries in the system',
    color: '#4F39F6',
    dots: ['#432DD7', '#432DD7', '#432DD7'],
  },
  {
    number: 2,
    title: 'Receive Stock',
    desc: 'Record incoming goods with batch numbers',
    color: '#00A63E',
    dots: ['#00A63E', '#00A63E', '#00A63E'],
  },
  {
    number: 3,
    title: 'Process Sales',
    desc: 'Sell products using POS system',
    color: '#364153',
    dots: ['#FFD6A8', '#101828', '#FFD6A8'],
  },
  {
    number: 4,
    title: 'Monitor Expiry',
    desc: 'Track and act on expiry alerts',
    color: '#FFD6A8',
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