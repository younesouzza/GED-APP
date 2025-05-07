import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './adminSideBar.css';
import {
  Home,
  ManageAccounts,
  Folder,
  Inbox,
  Person2,
  Logout,
  ShowChart
} from '@mui/icons-material';

export default function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">

            <li
              className={`sidebarListItem ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin')}
            >
              <Home className="sidebarIcon" />
              Home
            </li>

            <li
              className={`sidebarListItem ${isActive('/admin/analytics') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/analytics')}
            >
              <ShowChart className="sidebarIcon" />
              Analytics
            </li>

            <li
              className={`sidebarListItem ${isActive('/admin/manageusers') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/manageusers')}
            >
              <ManageAccounts className="sidebarIcon" />
              Manage Users
            </li>

            <li
              className={`sidebarListItem ${isActive('/admin/folders') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/folders')}
            >
              <Folder className="sidebarIcon" />
              Manage Folders
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menu</h3>
          <ul className="sidebarList">
            <li
              className={`sidebarListItem ${isActive('/admin/inbox') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/inbox')}
            >
              <Inbox className="sidebarIcon" />
              Inbox
            </li>

            <li
              className={`sidebarListItem ${isActive('/admin/profile') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/profile')}
            >
              <Person2 className="sidebarIcon" />
              Profile
            </li>

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
