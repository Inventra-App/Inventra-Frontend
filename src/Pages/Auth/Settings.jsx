import React from 'react'
import './Css/Settings.css'
import SideBar from '../../Components/SideBar'
import DashboardHeader from '../../Components/DashboardHeader'

const Settings = () => {
  return (
    <div className="dashboard-page">
        <SideBar/>
        <div className="dashboard-main">
            <DashboardHeader/>
        </div>
      
    </div>
  )
}

export default Settings
