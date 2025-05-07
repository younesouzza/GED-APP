import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { Home, Folder, CreateNewFolder, Inbox, Person2, Logout } from "@mui/icons-material";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li
              className={`sidebarListItem ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <Home className="sidebarIcon" />
              Home
            </li>

            <li
              className={`sidebarListItem ${
                location.pathname === "/dashboard/files" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/dashboard/files")}
            >
              <Folder className="sidebarIcon" />
              Files
            </li>

            <li
              className={`sidebarListItem ${
                location.pathname === "/dashboard/newFile" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/dashboard/newFile")}
            >
              <CreateNewFolder className="sidebarIcon" />
              Create New File
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menu</h3>
          <ul className="sidebarList">
            <li
              className={`sidebarListItem ${
                location.pathname === "/dashboard/inbox" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/dashboard/inbox")}
            >
              <Inbox className="sidebarIcon" />
              Inbox
            </li>

            <li
              className={`sidebarListItem ${
                location.pathname === "/dashboard/profile" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/dashboard/profile")}
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
