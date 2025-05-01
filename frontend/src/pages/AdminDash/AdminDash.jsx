import React from 'react'
import './AdDash.css'
import AdminTopbar from '../../components/Adtopbar/AdminTopBar'
import AdminSideBar from '../../components/AdSidebar/AdminSideBar'
import { Outlet } from 'react-router-dom'



export default function AdminDash() {
  return (
    <div>
        <AdminTopbar/>
        <div className="container">
            <AdminSideBar/>
            
            <Outlet/>

        </div>
      
    </div>
  )
}
