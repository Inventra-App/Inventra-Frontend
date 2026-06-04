import React from 'react'
import './Css/Sales.css'
import SideBar from '../../Components/SideBar'
import DashboardHeader from '../../Components/DashboardHeader'

const Sales = () => {
  return (
    <div className="dashboard-page">
        <SideBar/>
        <div className="dashboard-main">
            <DashboardHeader/>
        </div>
      
    </div>
  )
}

export default Sales
