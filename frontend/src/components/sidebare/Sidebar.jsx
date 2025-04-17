
import "./Sidebar.css"
import {Home , Folder, CreateNewFolder, Inbox, Person2, Logout} from '@mui/icons-material';

export default function Sidebare() {
  return (
    <div className='sidebar'>
       <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem active">
              <Home className="sidebarIcon"/>
              Home
            </li>
            <li className="sidebarListItem">
              <Folder className="sidebarIcon"/>
              files
            </li>
            <li className="sidebarListItem">
              <CreateNewFolder className="sidebarIcon"/>
              create new file
            </li>
          
            
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menu</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem ">
              <Inbox className="sidebarIcon"/>
              Inbox
            </li>
            <li className="sidebarListItem">
              <Person2 className="sidebarIcon"/>
              Profile
            </li>
            <li className="sidebarListItem">
              <Logout className="sidebarIcon"/>
              Log out
            </li>
          
            
          </ul>
        </div>

       </div>

      
    </div>
  )
}
