// Profile.jsx 
import React, { useState, useEffect } from 'react';
import './profile.css';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import api from '../../../services/api'; 

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
  const [editingName, setEditingName] = useState(false);
  
  // Temp values for editing
  const [tempUsername, setTempUsername] = useState(userData.username);
  const [tempEmail, setTempEmail] = useState(userData.email);
  const [tempName, setTempName] = useState(userData.name);
  const [tempPassword, setTempPassword] = useState('');
  const [tempConfirmPassword, setTempConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
   // Add debug state to track API call attempts
   const [apiAttempts, setApiAttempts] = useState(0);
  
  // Track if any changes were made to show save/cancel buttons
  const [hasChanges, setHasChanges] = useState(false);
  // Store userId for convenience
  const [userId, setUserId] = useState('');

  // Check if user is authenticated
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      const hasToken = !!token && token !== 'null' && token !== 'undefined';
      console.log('Authentication check:', hasToken ? 'Token exists' : 'No valid token');
      return hasToken;
    } catch (e) {
      console.error('Error checking authentication:', e);
      return false;
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    console.group('🔑 Profile Component Initialization');
    
    // Debug authentication status
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 10) + '...' + token.substring(token.length - 10));
    }
    
    console.log('User ID exists:', !!storedUserId);
    if (storedUserId) console.log('User ID:', storedUserId);
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.warn('⚠️ Not authenticated - cannot fetch user data');
      setErrorMsg('Please log in to view your profile.');
      console.groupEnd();
      return;
    }
    
    // Check for userId
    if (storedUserId && storedUserId !== 'null' && storedUserId !== 'undefined') {
      setUserId(storedUserId);
      console.log(' User ID valid, will fetch data for:', storedUserId);
      fetchUserData(storedUserId);
    } else {
      console.error(' User ID missing or invalid:', storedUserId);
      setErrorMsg('User ID not found. Please log in again.');
    }
    
    console.groupEnd();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch user data from the backend
  const fetchUserData = async (currentUserId) => {
    // Increment attempt counter for debugging
    setApiAttempts(prev => prev + 1);
    console.group(` Fetch User Data (Attempt ${apiAttempts + 1})`);
    
    // Validate userId
    if (!currentUserId || currentUserId === 'null' || currentUserId === 'undefined') {
      setErrorMsg("Cannot fetch data: User ID is missing or invalid.");
      console.error(" fetchUserData called with invalid userId:", currentUserId);
      console.groupEnd();
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    try {
      console.log(' Attempting to fetch user data...');
      
      // First, try using /api/users/me endpoint
      try {
        console.log('Method 1: Trying /api/users/me');
        const response = await api.get('/api/users/me');
        handleUserDataResponse(response);
        console.log(' Method 1 succeeded!');
        console.groupEnd();
        return;
      } catch (error1) {
        console.warn('⚠️ Method 1 failed:', error1.response?.status || error1.message);
        
        // Second, try with userId directly
        try {
          console.log('Method 2: Trying /api/users/' + currentUserId);
          const response = await api.get(`/api/users/${currentUserId}`);
          handleUserDataResponse(response);
          console.log(' Method 2 succeeded!');
          console.groupEnd();
          return;
        } catch (error2) {
          console.warn('⚠️ Method 2 failed:', error2.response?.status || error2.message);
          
          // Third, try direct fetch as fallback (bypass axios)
          try {
            console.log('Method 3: Direct fetch fallback');
            const response = await api.directFetch('/api/users/me');
            handleUserDataResponse({ data: response.data, status: response.status });
            console.log(' Method 3 succeeded!');
            console.groupEnd();
            return;
          } catch (error3) {
            console.error(' All methods failed');
            throw error3; // Re-throw to be caught by the outer catch
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      let errorMessage = 'Failed to load user data. ';
      
      // Provide a more detailed error message based on the error
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage += 'Access denied. Your session may have expired. Please try logging in again.';
        } else if (error.response.status === 404) {
          errorMessage += `User data not found for ID: ${currentUserId}.`;
        } else {
          errorMessage += error.response.data?.message || `Server returned ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage += 'No response from server. Check your connection.';
      } else {
        errorMessage += error.message || 'Unknown error occurred';
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };
  const handleUserDataResponse = (response) => {
    const user = response.data.data || response.data;
    
    console.log('User data received:', user);
    
    // Format join date from timestamp
    const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }) : 'N/A';

    setUserData({
      name: user.name || user.fullName || 'User',
      username: user.username || 'N/A',
      email: user.email || 'N/A',
      password: '********', 
      accountType: user.role === 'admin' ? 'Admin' : 
                  user.role === 'reviewer' ? 'Reviewer' : 'Standard',
      joinDate,
      uploads: user.uploads || 0,
      messages: user.messages || 0,
      hasCustomAvatar: !!user.avatar // Check if avatar field exists
    });

    // Set temp values for editing fields
    setTempUsername(user.username || '');
    setTempEmail(user.email || '');
    setTempName(user.name || user.fullName || 'User');
  };

  // Function to handle profile picture change
  const handleProfilePicChange = async () => {
    if (!userId) {
        setErrorMsg("Cannot change picture: User ID is missing.");
        return;
    }
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (e) => {
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        const file = e.target.files[0];
        if (file) {
          // Create form data for file upload
          const formData = new FormData();
          formData.append('avatar', file);
          
          try {
           
            await api.put(`/api/users/me/avatar`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            
            // Update local state and force image refresh by changing key
            setUserData({ 
              ...userData, 
              hasCustomAvatar: true 
            });
            // Force refresh by updating userId state slightly (or use a dedicated refresh state)
            setUserId(uid => uid + ''); 
            setSuccessMsg('Profile picture updated successfully');
          } catch (error) {
            console.error('Error uploading avatar:', error);
            setErrorMsg(error.response?.data?.message || error.message || 'Failed to upload profile picture');
          } finally {
            setIsLoading(false);
          }
        }
      };
      fileInput.click();
    } catch (error) {
      console.error('Error with file selection:', error);
      setErrorMsg('Failed to select profile picture');
    }
  };

  // Function to save all changes (Name, Username, Email)
  const saveChanges = async () => {
    if (!userId) {
        setErrorMsg("Cannot save changes: User ID is missing.");
        return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      // Prepare updated user data from state (which was updated by saveName, saveUsername, saveEmail)
      const updatedData = {
        name: userData.name,
        username: userData.username,
        email: userData.email
      };
      
      
      await api.put(`/api/users/me`, updatedData);
      
      // Reset all editing states
      setEditingUsername(false);
      setEditingEmail(false);
      setEditingName(false);
      setChangingPassword(false);
      setHasChanges(false);
      
      // Show success message
      setSuccessMsg('Changes saved successfully!');
      
      
    } catch (error) {
      console.error('Error saving changes:', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to cancel all changes
  const cancelChanges = () => {
    // Refetch data to discard all local edits and reset temp values
    if (userId) {
        fetchUserData(userId);
    } else {
        // If no userId, just reset based on initial state 
        setTempUsername(userData.username);
        setTempEmail(userData.email);
        setTempName(userData.name);
    }
    setTempPassword('');
    setTempConfirmPassword('');
    setCurrentPassword('');
    
    // Reset all editing states
    setEditingUsername(false);
    setEditingEmail(false);
    setEditingName(false);
    setChangingPassword(false);
    setHasChanges(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Function to handle username save (updates local state, saved via saveChanges)
  const saveUsername = () => {
    if (tempUsername.trim() === '') {
      setErrorMsg('Username cannot be empty');
      return;
    }
    
    setUserData({ ...userData, username: tempUsername });
    setEditingUsername(false);
    setHasChanges(true);
    setErrorMsg('');
  };

  // Function to handle name save (updates local state, saved via saveChanges)
  const saveName = () => {
    if (tempName.trim() === '') {
      setErrorMsg('Name cannot be empty');
      return;
    }
    
    setUserData({ ...userData, name: tempName });
    setEditingName(false);
    setHasChanges(true);
    setErrorMsg('');
  };

  // Function to handle email save (updates local state, saved via saveChanges)
  const saveEmail = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    
    setUserData({ ...userData, email: tempEmail });
    setEditingEmail(false);
    setHasChanges(true);
    setErrorMsg('');
  };

  // Function to handle password change
  const savePassword = async () => {
    if (!userId) {
        setErrorMsg("Cannot change password: User ID is missing.");
        return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    
    // Validate new password
    if (tempPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    
    // Check if passwords match
    if (tempPassword !== tempConfirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
       
      await api.put(`/api/users/me/password`, {
        currentPassword,
        newPassword: tempPassword
      });
      
      // Reset password fields
      setChangingPassword(false);
      setTempPassword('');
      setTempConfirmPassword('');
      setCurrentPassword('');
      setSuccessMsg('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate avatar URL
  const getAvatarUrl = () => {
    // Ensure userId is valid before constructing URL
    if (!userId || userId === 'null' || userId === 'undefined') return ''; 
    // Use the base URL from the configured api instance
    const baseUrl = api.defaults.baseURL;
    // Add timestamp to prevent caching
    // Ensure the final URL includes the /api prefix
    return `${baseUrl}/api/users/${userId}/avatar?t=${new Date().getTime()}`;
  };

  return (
    <div className='profilePage'>
      <div className="profileContainer">
        
        {/* Status messages */}
        {errorMsg && <div className="errorMessage">{errorMsg}</div>}
        {successMsg && <div className="successMessage">{successMsg}</div>}
        {isLoading && <div className="loadingIndicator">Loading...</div>}
        
        <div className="profileHeader">
          <div className="avatarCenter">
            <div className="avatarCircle">
              {userData.hasCustomAvatar && userId ? (
                <img 
                  key={getAvatarUrl()} // Use URL as key to force refresh on change
                  src={getAvatarUrl()} 
                  alt="Profile" 
                  className="avatarImage"
                  onError={(e) => { e.target.onerror = null; e.target.style.display='none'; /* Hide broken img */ }}
                />
              ) : (
                <PersonOutlineIcon className="personIcon" />
              )}
              <div className="editIcon">
                <button className="editAvatarBtn" onClick={handleProfilePicChange} disabled={isLoading || !userId}>
                  <EditIcon fontSize="small" />
                </button>
              </div>
            </div>
            <div className="usernameDisplay">
              {userData.username}
            </div>
          </div>
          
          <h2 className="centerUserName">{userData.name}</h2>
          
          <p className="userStatus">Active since: {userData.joinDate}</p>
        </div>

        <div className="stats">
          {/* Stats content remains the same */}
          <div className="statCard">
            <div className="statIcon">
              <CloudUploadIcon />
            </div>
            <div className="statInfo">
              <h4>Total uploads</h4>
              <p className="statValue">{userData.uploads}</p>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon">
              <MessageIcon />
            </div>
            <div className="statInfo">
              <h4>Total messages</h4>
              <p className="statValue">{userData.messages}</p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h3>Account Information</h3>
          
          {/* Name field */}
          <div className="infoItem">
            <label>Name:</label>
            {editingName ? (
              <div className="infoContent editing">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="editInput"
                  disabled={isLoading}
                  autoComplete="name" // Added autocomplete
                />
                <div className="editActions">
                  <button className="actionBtn confirmBtn" onClick={saveName} disabled={isLoading}>
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setEditingName(false)} disabled={isLoading}>
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="infoContent">
                <span>{userData.name}</span>
                <button className="editBtn" onClick={() => {
                  setEditingName(true);
                  setTempName(userData.name);
                }} disabled={isLoading || !userId}>
                  <EditIcon fontSize="small" /> Edit
                </button>
              </div>
            )}
          </div>
          
          {/* Username field */}
          <div className="infoItem">
            <label>Username:</label>
            {editingUsername ? (
              <div className="infoContent editing">
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="editInput"
                  disabled={isLoading}
                  autoComplete="username" // Added autocomplete
                />
                <div className="editActions">
                  <button className="actionBtn confirmBtn" onClick={saveUsername} disabled={isLoading}>
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setEditingUsername(false)} disabled={isLoading}>
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
                }} disabled={isLoading || !userId}>
                  <EditIcon fontSize="small" /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Email field */}
          <div className="infoItem">
            <label>Email:</label>
            {editingEmail ? (
              <div className="infoContent editing">
                <input 
                  type="email" 
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="editInput"
                  disabled={isLoading}
                  autoComplete="email" // Added autocomplete
                />
                <div className="editActions">
                  <button className="actionBtn confirmBtn" onClick={saveEmail} disabled={isLoading}>
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setEditingEmail(false)} disabled={isLoading}>
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
                }} disabled={isLoading || !userId}>
                  <EditIcon fontSize="small" /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Password field */}
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
                    disabled={isLoading}
                    autoComplete="current-password" 
                  />
                </div>
                <div className="formGroup">
                  <label>New Password:</label>
                  <input 
                    type="password" 
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="editInput"
                    disabled={isLoading}
                    autoComplete="new-password" 
                  />
                </div>
                <div className="formGroup">
                  <label>Confirm New Password:</label>
                  <input 
                    type="password" 
                    value={tempConfirmPassword}
                    onChange={(e) => setTempConfirmPassword(e.target.value)}
                    className="editInput"
                    disabled={isLoading}
                    autoComplete="new-password" 
                  />
                </div>
                <div className="formActions">
                  <button className="actionBtn confirmBtn" onClick={savePassword} disabled={isLoading}>
                    Save Password
                  </button>
                  <button className="actionBtn cancelBtn" onClick={() => setChangingPassword(false)} disabled={isLoading}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="infoContent">
                <span>********</span>
                <button className="editBtn" onClick={() => setChangingPassword(true)} disabled={isLoading || !userId}>
                  <LockIcon fontSize="small" /> Change Password
                </button>
              </div>
            )}
          </div>

          {/* Account Type (Read-only) */}
          <div className="infoItem">
            <label>Account Type:</label>
            <div className="infoContent">
              <span>{userData.accountType}</span>
            </div>
          </div>
        </div>

        {/* Save/Cancel buttons for overall changes */}
        {hasChanges && (
          <div className="profileActions">
            <button className="saveBtn" onClick={saveChanges} disabled={isLoading || !userId}>
              Save All Changes
            </button>
            <button className="cancelBtn" onClick={cancelChanges} disabled={isLoading}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

