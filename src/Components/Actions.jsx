import React, { useState } from 'react'
import faqData from '../Components/faqData'
import action from '../Assets/Action.png'
import '../Css/Actions.css'

const Actions = () => {
  const [activeTab, setActiveTab] = useState(faqData[0].tab)
  const [openIndex, setOpenIndex] = useState(null)

  const currentTab = faqData.find((item) => item.tab === activeTab)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleTab = (tab) => {
    setActiveTab(tab)
    setOpenIndex(null)
  }

  return (
    <div className="actions-section">

      <div className="actions-left">
        <div className="actions-tabs">
          {faqData.map((item) => (
            <span
              key={item.tab}
              className={`actions-tab ${activeTab === item.tab ? 'actions-tab-active' : ''}`}
              onClick={() => handleTab(item.tab)}
            >
              {item.tab}
            </span>
          ))}
        </div>

        <div className="actions-questions">
          {currentTab.questions.map((item, index) => (
            <div key={index} className="actions-item">
              <div className="actions-question" onClick={() => toggle(index)}>
                <span>{item.question}</span>
                <span className="actions-chevron">{openIndex === index ? '∧' : '∨'}</span>
              </div>
              {openIndex === index && (
                <p className="actions-answer">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="actions-right">
        <img src={action} alt="Action" className="actions-img" />
      </div>

    </div>
  )
}

export default Actions