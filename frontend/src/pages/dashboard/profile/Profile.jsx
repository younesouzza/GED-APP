// Profile.jsx
import React, { useState } from 'react';
import './profile.css';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Profile() {
  // User state with initial data
  const [userData, setUserData] = useState({
    name: 'User Name',
    username: 'exampleuser',
    email: 'example@example.com',
    password: '********',
    accountType: 'Standard',
    joinDate: 'April 2025',
    uploads: 0,
    messages: 0,
    hasCustomAvatar: false
  });

  // Edit states for different fields
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Temp values for editing
  const [tempUsername, setTempUsername] = useState(userData.username);
  const [tempEmail, setTempEmail] = useState(userData.email);
  const [tempPassword, setTempPassword] = useState('');
  const [tempConfirmPassword, setTempConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // Track if any changes were made to show save/cancel buttons
  const [hasChanges, setHasChanges] = useState(false);

  // Function to handle profile picture change
  const handleProfilePicChange = () => {
    // In a real app, this would open a file picker
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Here you would normally upload the file to a server
        // For demo purposes, we'll just mark that a custom avatar has been set
        setUserData({ 
          ...userData, 
          hasCustomAvatar: true 
        });
        setHasChanges(true);
        
        // For a real implementation, you would handle the file upload
        // and store the URL/path to the uploaded image
        console.log("Profile picture changed:", file.name);
      }
    };
    fileInput.click();
  };

  // Function to save all changes
  const saveChanges = () => {
    // In a real app, this would send data to a server
    // For demo, we just update the state
    
    // Reset all editing states
    setEditingUsername(false);
    setEditingEmail(false);
    setChangingPassword(false);
    setHasChanges(false);
    
    // Show success message
    alert('Changes saved successfully!');
  };

  // Function to cancel all changes
  const cancelChanges = () => {
    // Reset all temp values to current values
    setTempUsername(userData.username);
    setTempEmail(userData.email);
    setTempPassword('');
    setTempConfirmPassword('');
    setCurrentPassword('');
    
    // Reset all editing states
    setEditingUsername(false);
    setEditingEmail(false);
    setChangingPassword(false);
    setHasChanges(false);
  };

  // Function to handle username save
  const saveUsername = () => {
    if (tempUsername.trim() === '') {
      alert('Username cannot be empty');
      return;
    }
    
    setUserData({ ...userData, username: tempUsername });
    setEditingUsername(false);
    setHasChanges(true);
  };

  // Function to handle email save
  const saveEmail = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setUserData({ ...userData, email: tempEmail });
    setEditingEmail(false);
    setHasChanges(true);
  };

  // Function to handle password change
  const savePassword = () => {
    // Validate current password (in a real app, this would verify against the server)
    if (currentPassword !== 'password123') { // Demo check
      alert('Current password is incorrect');
      return;
    }
    
    // Validate new password
    if (tempPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    // Check if passwords match
    if (tempPassword !== tempConfirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Update password (in a real app, this would be encrypted)
    setUserData({ ...userData, password: '********' }); // Display masked password
    setChangingPassword(false);
    setTempPassword('');
    setTempConfirmPassword('');
    setCurrentPassword('');
    setHasChanges(true);
    
    alert('Password changed successfully!');
  };

  return (
    <div className='profilePage'>
      <div className="profileContainer">
        
      <div className="profileHeader">
        <div className="avatarNew">
            <div className="avatarCircle">
            <PersonOutlineIcon className="personIcon" />
            <div className="editProfileWrapper">
                <button className="editProfileBtn" onClick={handleProfilePicChange}>
                <EditIcon fontSize="small" />
                <span>Edit Profile</span>
                </button>
            </div>
            </div>
            <div className="avatarName">{userData.name}</div>
        </div>
        <h2>{userData.name}</h2>
        <p className="userStatus">Active since: {userData.joinDate}</p>
      </div>

        <div className="stats">
          <div className="statCard">
            <div className="statIcon">
              <CloudUploadIcon />
            </div>
            <div className="statInfo">
              <h4>Total uploads</h4>
              <p>{userData.uploads}</p>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon">
              <MessageIcon />
            </div>
            <div className="statInfo">
              <h4>Total messages</h4>
              <p>{userData.messages}</p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h3>Account Information</h3>
          
          <div className="infoItem">
            <label>Username:</label>
            {editingUsername ? (
              <div className="infoContent editing">
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="editInput"
                />
                <div className="editActions">
                  <button className="actionBtn confirmBtn" onClick={saveUsername}>
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setEditingUsername(false)}>
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="infoContent">
                <span>{userData.username}</span>
                <button className="editBtn" onClick={() => {
                  setEditingUsername(true);
                  setTempUsername(userData.username);
                }}>
                  <EditIcon fontSize="small" /> Edit
                </button>
              </div>
            )}
          </div>

          <div className="infoItem">
            <label>Email:</label>
            {editingEmail ? (
              <div className="infoContent editing">
                <input 
                  type="email" 
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="editInput"
                />
                <div className="editActions">
                  <button className="actionBtn confirmBtn" onClick={saveEmail}>
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setEditingEmail(false)}>
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="infoContent">
                <span>{userData.email}</span>
                <button className="editBtn" onClick={() => {
                  setEditingEmail(true);
                  setTempEmail(userData.email);
                }}>
                  <EditIcon fontSize="small" /> Edit
                </button>
              </div>
            )}
          </div>

          <div className="infoItem">
            <label>Password:</label>
            {changingPassword ? (
              <div className="passwordChangeForm">
                <div className="formGroup">
                  <label>Current Password:</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="editInput"
                  />
                </div>
                <div className="formGroup">
                  <label>New Password:</label>
                  <input 
                    type="password" 
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="editInput"
                  />
                </div>
                <div className="formGroup">
                  <label>Confirm New Password:</label>
                  <input 
                    type="password" 
                    value={tempConfirmPassword}
                    onChange={(e) => setTempConfirmPassword(e.target.value)}
                    className="editInput"
                  />
                </div>
                <div className="formActions">
                  <button className="actionBtn saveBtn" onClick={savePassword}>Save</button>
                  <button className="actionBtn cancelBtn" onClick={() => setChangingPassword(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="infoContent">
                <span>{userData.password}</span>
                <button className="editBtn" onClick={() => setChangingPassword(true)}>
                  <LockIcon fontSize="small" /> Change
                </button>
              </div>
            )}
          </div>
          
          <div className="infoItem">
            <label>Account type:</label>
            <div className="infoContent">
              <span>{userData.accountType}</span>
            </div>
          </div>
        </div>
        
        {hasChanges && (
          <div className="profileActions">
            <button className="saveBtn" onClick={saveChanges}>Save Changes</button>
            <button className="cancelBtn" onClick={cancelChanges}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}