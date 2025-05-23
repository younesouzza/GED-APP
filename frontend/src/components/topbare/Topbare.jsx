import React from "react";
import './Topbare.css';
import { useNavigate } from "react-router-dom";
import {NotificationsNone,Settings } from '@mui/icons-material';

export default function Topbare() {
    const navigate = useNavigate();

  
  const handleNavigation = (path) => {
    navigate(path);
  };
    return(
    <div className="topbare">
        <div className="topbarewrapper">
            <div className="topLeft">
                
            </div>
            
            <div className="topRight">
                <div className="topbarIconsContainer">
                    <NotificationsNone/>
                    <span className="topIconbadge">2</span>
                    

                </div>
                <div className="topbarIconsContainer" onClick={() => handleNavigation("/dashboard/Profile")}>
                    <Settings/>
                    
                </div>
                <img src="/pdp.png" alt="profile" className="topavatar" />
            </div>
        </div>
    </div>
        
    )
}