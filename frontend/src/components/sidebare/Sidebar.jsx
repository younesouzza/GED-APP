
import "./Sidebar.css"
import {LineStyle , Folder, CreateNewFolder} from '@mui/icons-material';

export default function Sidebare() {
  return (
    <div className='sidebar'>
       <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem active">
              <LineStyle className="sidebarIcon"/>
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
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem active">
              <LineStyle className="sidebarIcon"/>
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

       </div>

      
    </div>
  )
}
