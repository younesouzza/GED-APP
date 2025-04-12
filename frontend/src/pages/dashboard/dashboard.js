import React from 'react'
import Topbare from '../../components/topbare/Topbare'
import Sidebare from '../../components/sidebare/Sidebar'
import "./dashboard.css"
//import { Dashboard } from '@mui/icons-material'

function Dashboard() {
  return (
    <div>
      <Topbare/>
      <div className='container'>
        <Sidebare/>
        <div className='others'>
          other pageq
          


        </div>
        
       
        
      </div>
      
    </div>
  )
}
export default Dashboard