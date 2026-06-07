import React, { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import './ModalStyles/ToastNotification.css'

const ToastNotification = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="toast-notification">
      <div className="toast-content">
        <CheckCircle size={18} className="toast-icon" />
        <span>{message}</span>
      </div>
    </div>
  )
}

export default ToastNotification