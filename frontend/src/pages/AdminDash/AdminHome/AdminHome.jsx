import React from 'react'
import './adminHome.css'
import {Person} from '@mui/icons-material';

export default function AdminHome() {
  
  
  return (
    
    <div className='adminHomePage'>
      <div className="WelcomeSection">
        <h1 className='WelcomeTitle'>Welcome Back</h1>


      </div>
      {/*last regestred membres*/}
      <div className="NewMembres">
        <div className="widget">
          <div className="widgetTitle">
            <h2>New Membres</h2>
            <button className="viewAllBtn" >View All</button>
          </div>
          <div className="widgetContent">
            <User
              Name="Mike" 
              email="Mike@fmail.com"
              regestrationDate ="09/04/2025"
              role="Standard"
              />
              <User
              Name="Mike" 
              email="Mike@fmail.com"
              regestrationDate ="09/04/2025"
              role="Standard"
              />
              <User
              Name="Mike" 
              email="Mike@fmail.com"
              regestrationDate ="09/04/2025"
              role="Standard"
              />
              <User
              Name="Mike" 
              email="Mike@fmail.com"
              regestrationDate ="09/04/2025"
              role="Standard"
              />

          </div>
        </div>
      </div>
      
    </div>
  )
}
const User =( {Name , email, regestrationDate ,role}) =>{
  return(
    <div className="userItem">
      <div className="userIcon">
        <Person fontSize='small'/>
      </div>
      <div className="userInfo">
        <h3 className='userName'>{Name}</h3>
        <div className="userDetails">
          <span className='userEmail'>Email : {email}</span>
          <span className='userRegestrationDtae'>Regestration date : {regestrationDate}</span>
          <span className='userRole'>Role : {role}</span>
        </div>
      </div>

    </div>
  )
}
