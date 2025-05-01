import './adminTopBar.css';
import { useNavigate } from "react-router-dom";
import {NotificationsNone,Settings } from '@mui/icons-material';

export default function AdminTopbar() {
    const navigate = useNavigate();

  
  const handleNavigation = (path) => {
    navigate(path);
  };
    return(
    <div className="topbare">
        <div className="topbarewrapper">
            <div className="topLeft">
                <span className='title'>Admin</span>
                
            </div>
            
            <div className="topRight">
                <div className="topbarIconsContainer">
                    <NotificationsNone/>
                    <span className="topIconbadge">2</span>
                    

                </div>
                <div className="topbarIconsContainer" onClick={() => handleNavigation("")}>
                    <Settings/>
                    
                </div>
                <img src="/pdp.png" alt="profile" className="topavatar" />
            </div>
        </div>
    </div>
        
    )
}
