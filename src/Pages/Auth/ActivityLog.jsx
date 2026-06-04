import React from 'react'
import './Css/ActivityLog.css'
import SideBar from '../../Components/SideBar'
import DashboardHeader from '../../Components/DashboardHeader'

const ActivityLog = () => {
  return (
    <div className="dashboard-page">
        <SideBar/>
        <div className="dashboard-main">
            <DashboardHeader/>
        </div>
      
    </div>
  )
}

export default ActivityLog
