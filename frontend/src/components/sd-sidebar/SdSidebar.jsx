import React from 'react';
import './sdSideBar.css';
import { useNavigate, useLocation } from "react-router-dom";

import { Home, Folder, CreateNewFolder, Inbox, Person2, Logout } from "@mui/icons-material";


export default function SdSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Function to handle navigation
    const handleNavigation = (path) => {
      navigate(path);
    };
  
    // Function to handle logout
    const handleLogout = () => {
      // Clear the JWT token from localStorage (or sessionStorage if used)
      localStorage.removeItem("authToken");
  
      // Redirect the user to the login page
      navigate("/login");
    };
    
    // Helper to check if a path is active
    const isActive = (path) => location.pathname === path;
  
    return (
      <div className="sidebar">
        <div className="sidebarWrapper">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Dashboard</h3>
            <ul className="sidebarList">
              {/* Home */}
              <li
                className={`sidebarListItem ${isActive("/sd-dashboard") ? 'active' : ''}`}
                onClick={() => handleNavigation("/sd-dashboard")}
              >
                <Home className="sidebarIcon" />
                Home
              </li>
  
              {/* Files */}
              <li
                className={`sidebarListItem ${isActive("/sd-dashboard/files") ? 'active' : ''}`}
                onClick={() => handleNavigation("/sd-dashboard/files")}
              >
                <Folder className="sidebarIcon" />
                Files
              </li>
  
              {/* Create New File */}
              <li
                className={`sidebarListItem ${isActive("/sd-dashboard/newFile") ? 'active' : ''}`}
                onClick={() => handleNavigation("/sd-dashboard/newFile")}
              >
                <CreateNewFolder className="sidebarIcon" />
                Create New File
              </li>
            </ul>
          </div>
  
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Menu</h3>
            <ul className="sidebarList">
              {/* Profile */}
              <li
                className={`sidebarListItem ${isActive("/sd-dashboard/profile") ? 'active' : ''}`}
                onClick={() => handleNavigation("/sd-dashboard/profile")}
              >
                <Person2 className="sidebarIcon" />
                Profile
              </li>
  
              {/* Log out */}
              <li className="sidebarListItem" onClick={handleLogout}>
                <Logout className="sidebarIcon" />
                Log Out
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }