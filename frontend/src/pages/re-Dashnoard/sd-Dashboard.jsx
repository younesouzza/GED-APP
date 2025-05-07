import React from 'react'
import './sdDashboard.css'
import Topbare from '../../components/topbare/Topbare'
import SdSidebar from '../../components/sd-sidebar/SdSidebar'
import { Outlet } from 'react-router-dom'

export default function ReDashboard() {
  return (
    <div>
        <Topbare/>
        <div className="container">
            <SdSidebar/>
            <Outlet/>

        </div>
      
    </div>
  )
}
