import React from 'react'
import { useNavigate } from 'react-router-dom';
import './adminSideBar.css'
import { Home,  CreateNewFolder, Inbox, Person2, Logout, ImageOutlined, ShowChart } from "@mui/icons-material";

export default function AdminSideBar() {
  const navigate = useNavigate();

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

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            {/* Home */}
            <li
              className="sidebarListItem"
              onClick={() => handleNavigation("")}
            >
              <Home className="sidebarIcon" />
              Home
            </li>

            {/* Files */}
            <li
              className="sidebarListItem"
              onClick={() => handleNavigation("/admin/analytics")}
            >
              <ShowChart className="sidebarIcon" />
              Analytics
            </li>

            {/* Create New File */}
            <li
              className="sidebarListItem"
              onClick={() => handleNavigation("")}
            >
              <CreateNewFolder className="sidebarIcon" />
              Create New File
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menu</h3>
          <ul className="sidebarList">
            {/* Inbox */}
            <li
              className="sidebarListItem"
              onClick={() => handleNavigation("")}
            >
              <Inbox className="sidebarIcon" />
              Inbox
            </li>

            {/* Profile */}
            <li
              className="sidebarListItem"
              onClick={() => handleNavigation("")}
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
