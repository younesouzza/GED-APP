import React from "react";
import './Topbare.css';
import {NotificationsNone,Settings} from '@mui/icons-material';

export default function Topbare() {
    return(
    <div className="topbare">
        <div className="topbarewrapper">
            <div className="topLeft">
                <span className="logo">user</span>
            </div>
            <div className="topRight">
                <div className="topbarIconsContainer">
                    <NotificationsNone/>
                    <span className="topIconbadge">2</span>
                    

                </div>
                <div className="topbarIconsContainer">
                    <Settings/>
                    
                </div>
                <img src="/pdp.png" alt="profile" className="topavatar" />
            </div>
        </div>
    </div>
        
    )
}