import React from 'react'
import './Css/ExpiryMgm.css'
import SideBar from '../../Components/SideBar'
import DashboardHeader from '../../Components/DashboardHeader'

const ExpiryMgm = () => {
  return (
    <div className="dashboard-page">
        <SideBar/>
        <div className="dashboard-main">
            <DashboardHeader/>
        </div>
      
    </div>
  )
}

export default ExpiryMgm
