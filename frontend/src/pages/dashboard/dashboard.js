import React from 'react'
import Topbare from '../../components/topbare/Topbare'
import Sidebare from '../../components/sidebare/Sidebar'
import "./dashboard.css"
import Home from './homePage/home'

//import { Dashboard } from '@mui/icons-material'

function Dashboard() {
  return (
    <div>
      <Topbare/>
      <div className='container'>
        <Sidebare/>
        <Home/>
       
        
       
        
      </div>
      
    </div>
  )
}
export default Dashboard