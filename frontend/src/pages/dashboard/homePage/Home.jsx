import React from 'react';
import './home.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {Description,Send,MoreHoriz,DriveFolderUpload} from '@mui/icons-material';


const Home = () => {
   const navigate = useNavigate();
  
    
   const handleNavigation = (path) => {
    navigate(path);};
  return (
    <div className="homeContainer">
      {/* Welcome Header */}
      <div className="welcomeSection">
        <h1 className="welcomeTitle">Welcome back</h1>
        <p className="welcomeSubtitle">Continue your journey</p>
      </div>

      {/* Recent Files */}
      <div className="widgetContainer">
        <div className="widget">
          <div className="widgetTitle">
            <h2>Recent Uploads</h2>
            <Link to='/dashboard/files' className='viewAllBtn'>
            <button className="viewAllBtn" >View All</button>
            </Link>
            
          </div>
          <div className="widgetContent">
            <FileItem 
              title="Math Practice Test 3" 
              date="Apr 10, 2025" 
              subject="Mathematics"
            />
            <FileItem 
              title="Science Notes - Chapter 5" 
              date="Apr 8, 2025" 
              subject="Science"
            />
            <FileItem 
              title="Language Arts Essay Draft" 
              date="Apr 5, 2025" 
              subject="Language Arts"
            />
            <FileItem 
              title="Social Studies Flashcards" 
              date="Apr 2, 2025" 
              subject="Social Studies"
            />
          </div>
        </div>

        {/* Last Messages */}
        <div className="widget">
          <div className="widgetTitle">
            <h2>Last Messages</h2>
            <Link to='/dashboard/inbox' className='viewAllBtn'>
            <button className="viewAllBtn">View All</button>
            </Link>
          </div>
          <div className="widgetContent">
            <MessageItem 
              sender="Albert"
              date="Apr 14, 2025"
              preview="Updated Document"
            />
            <MessageItem 
              sender="Mike"
              date="Apr 13, 2025"
              preview="Birth certificate "
            />
            <MessageItem 
              sender="jhon"
              date="Apr 12, 2025"
              preview="Rapport"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quickActionsContainer">
        <h2 className="sectionTitle">Quick Actions</h2>
        <div className="actionsGrid"  >
          
          <div  onClick={() => handleNavigation("/dashboard/inbox")} >
            <ActionCard 
              title="Send files" 
              icon={<Send fontSize="medium" />} 
              color="#f3e8ff"
              textColor="#9333ea"
          />
          </div>
          <div  onClick={() => handleNavigation("/dashboard/newFile")}>
            <ActionCard 
              title="Upload new Documents" 
              icon={<DriveFolderUpload fontSize="medium" />} 
              color="#ffedd5"
              textColor="#ea580c"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

// File Item Component
const FileItem = ({ title, date, subject }) => {
  return (
    <div className="fileItem">
      <div className="fileIcon">
        <Description fontSize="small" />
      </div>
      <div className="fileInfo">
        <h3 className="fileTitle">{title}</h3>
        <div className="fileDetails">
          <span className="fileSubject">{subject}</span>
          <span className="fileDot">·</span>
          <span className="fileDate">{date}</span>
        </div>
      </div>
    </div>
  );
};

// Message Item Component
const MessageItem = ({ sender, date, preview }) => {
  return (
    <div className="messageItem">
      <div className="messageDetails">
        <h3 className="messageSender">{sender}</h3>
        <p className="messagePreview">{preview}</p>
      </div>
      <div className="messageMeta">
        <span className="messageDate">{date}</span>
        <button className="messageActionBtn">
          <MoreHoriz fontSize="small" />
        </button>
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, icon, color, textColor }) => {
  return (
    <div className="actionCard">
      <div className="actionIcon" style={{ backgroundColor: color, color: textColor }}>
        {icon}
      </div>
      <span className="actionTitle">{title}</span>
    </div>
  );
};

export default Home;