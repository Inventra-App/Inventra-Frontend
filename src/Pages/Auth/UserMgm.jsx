import React from 'react'
import './Css/UserMgm.css'
import SideBar from '../../Components/SideBar'
import DashboardHeader from '../../Components/DashboardHeader'

const UserMgm = () => {
  return (
    <div className="dashboard-page">
        <SideBar/>
        <div className="dashboard-main">
            <DashboardHeader/>
        </div>
      
    </div>
  )
}

export default UserMgm
