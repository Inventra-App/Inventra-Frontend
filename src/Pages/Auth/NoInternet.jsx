import React from 'react'
import { Info, RefreshCw, WifiOff } from 'lucide-react'
import './Css/ErrorPages.css'

const NoInternet = () => {
  const handleTryAgain = () => {
    window.location.reload()
  }

  return (
    <div className="internet-page">
      <div className="internet-content">
        <div className="internet-icon-circle">
          <WifiOff size={58} />
        </div>

        <h1>No internet connection</h1>
        <p>
          It looks like you're offline. Check your network
          <br />
          settings and try again.
        </p>

        <div className="internet-tips">
          <div className="internet-tip">
            <Info size={13} />
            <span>Check that Wi-Fi or mobile data is enabled</span>
          </div>
          <div className="internet-tip">
            <Info size={13} />
            <span>Try disabling and re-enabling your connection</span>
          </div>
          <div className="internet-tip">
            <Info size={13} />
            <span>Restart your router if using Wi-Fi</span>
          </div>
        </div>

        <button className="internet-try-btn" type="button" onClick={handleTryAgain}>
          <RefreshCw size={15} />
          <span>Try again</span>
        </button>

        <span className="internet-error-code">Error: ERR_INTERNET_DISCONNECTED</span>
      </div>
    </div>
  )
}

export default NoInternet
