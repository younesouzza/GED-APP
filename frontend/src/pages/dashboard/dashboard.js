import React from 'react'
import Topbare from '../../components/topbare/Topbare'
import Sidebare from '../../components/sidebare/Sidebar'
import "./dashboard.css"
import { Outlet } from 'react-router-dom'



function Dashboard() {
  return (
    <div>
      <Topbare/>
      <div className='container'>
        <Sidebare/>
        <Outlet/>
       
        
       
        
      </div>
      
    </div>
  )
}
export default Dashboard