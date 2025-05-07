import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If firstName or lastName changes, update the name field automatically
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName;
      const lastName = name === 'lastName' ? value : formData.lastName;
      setFormData(prev => ({
        ...prev,
        name: `${firstName} ${lastName}`.trim()
      }));
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      // --- Data Preparation ---
      let submitData;
      if (isLogin) {
        // For login, we only need email and password
        submitData = {
          email: formData.email,
          password: formData.password
        };
      } else {
        // For registration, ensure required fields
        if (!formData.username) {
          setError('Username is required');
          return; // Stop submission if username is missing
        }

        // Create a valid 'name' field from firstName/lastName or fallback to username
        let name = formData.name;
        if (!name || name.trim() === '') {
          if (formData.firstName || formData.lastName) {
            name = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
          } else {
            name = formData.username; // Use username as fallback for name if first/last are empty
          }
        }

        // Ensure name is not empty before submitting
        if (!name) {
            setError('Name could not be determined. Please provide first/last name or ensure username is set.');
            return; // Stop if name is still empty
        }

        submitData = {
          username: formData.username,
          name: name, // Use the constructed name
          email: formData.email,
          password: formData.password
        };
      }
      // --- End Data Preparation ---


      // --- API Call ---
      const response = await axios.post(`http://localhost:5000${endpoint}`, submitData);
      console.log("API Response Data:", response.data); // Log the whole response
      // Add detailed logging for keys
      if (response.data) {
        console.log("Keys in response.data:", Object.keys(response.data));
        if (response.data.data) {
          console.log("Keys in response.data.data:", Object.keys(response.data.data));
        } else {
          console.log("response.data.data is missing or falsy.");
        }
      } else {
        console.log("response.data is missing or falsy.");
      }
      // --- End API Call ---


      // --- Process Response and Store Data ---
      let token = null;
      let userId = null;
      let userRole = null;
      let userIdPath = "Not Found";
      let userRolePath = "Not Found";

      if (response.data) {
        // Try finding token
        token = response.data.token || response.data.data?.token;
        if (token) {
          localStorage.setItem("token", token);
          console.log("Token stored:", token);
        } else {
          console.warn("Token not found in response.data or response.data.data");
        }

        // Try finding userId in various common locations
        const data = response.data;
        const nestedData = response.data.data;

        if (data.userId) { userId = data.userId; userIdPath = "response.data.userId"; }
        else if (data.id) { userId = data.id; userIdPath = "response.data.id"; }
        else if (data._id) { userId = data._id; userIdPath = "response.data._id"; }
        else if (data.user?.id) { userId = data.user.id; userIdPath = "response.data.user.id"; }
        else if (data.user?._id) { userId = data.user._id; userIdPath = "response.data.user._id"; }
        else if (nestedData?.userId) { userId = nestedData.userId; userIdPath = "response.data.data.userId"; }
        else if (nestedData?.id) { userId = nestedData.id; userIdPath = "response.data.data.id"; }
        else if (nestedData?._id) { userId = nestedData._id; userIdPath = "response.data.data._id"; }
        else if (nestedData?.user?.id) { userId = nestedData.user.id; userIdPath = "response.data.data.user.id"; }
        else if (nestedData?.user?._id) { userId = nestedData.user._id; userIdPath = "response.data.data.user._id"; }

        if (userId) {
          localStorage.setItem("userId", userId);
          console.log(`User ID stored: ${userId} (Found at: ${userIdPath})`);
        } else {
          console.error("User ID not found in any common location within the response:", response.data);
        }

        // Try finding user role in various common locations
        if (data.role) { userRole = data.role; userRolePath = "response.data.role"; }
        else if (data.user?.role) { userRole = data.user.role; userRolePath = "response.data.user.role"; }
        else if (nestedData?.role) { userRole = nestedData.role; userRolePath = "response.data.data.role"; }
        else if (nestedData?.user?.role) { userRole = nestedData.user.role; userRolePath = "response.data.data.user.role"; }
        // Additional checks for variations in naming
        else if (data.userRole) { userRole = data.userRole; userRolePath = "response.data.userRole"; }
        else if (data.user?.userRole) { userRole = data.user.userRole; userRolePath = "response.data.user.userRole"; }
        else if (nestedData?.userRole) { userRole = nestedData.userRole; userRolePath = "response.data.data.userRole"; }
        else if (nestedData?.user?.userRole) { userRole = nestedData.user.userRole; userRolePath = "response.data.data.user.userRole"; }

        if (userRole) {
          localStorage.setItem("userRole", userRole);
          console.log(`User Role stored: ${userRole} (Found at: ${userRolePath})`);
        } else {
          console.warn("User Role not found in response - defaulting to 'standard'");
          localStorage.setItem("userRole", "standard"); // Default fallback
          userRole = "standard";
        }

      } else {
        console.error("API response.data is missing or falsy.");
      }
      
      // Proceed only if both token and userId were successfully found and stored
      if (token && userId) {
        // Navigate based on user role
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "reviewer") {
          navigate("/dashboard");
        } else {
          // Default to standard dashboard for any other role
          navigate("/sd-dashboard");
        }
      } else if (token && !userId) {
        // If token found but userId missing, show specific error
        setError("Authentication successful, but failed to retrieve user session information. Please try again or contact support.");
        // Optional: Clear the potentially stored token if userId is essential
        // localStorage.removeItem("token");
      } else {
        // Handle cases where token wasn't found or response was invalid
        setError("Received an invalid response from the server. Please try again.");
      }
      // --- End Process Response ---

    } catch (error) {
      // --- Error Handling ---
      // Log the detailed error object, especially error.response for API errors
      console.error('Authentication error:', error.response || error);

      // Extract a user-friendly message
      const errorMsg = error.response?.data?.message // Prefer backend message
                       || (isLogin ? 'Invalid Email or Password.' : 'Registration failed. Please check your details.') // Contextual fallback
                       || 'An unexpected error occurred.'; // Generic fallback

      setError(errorMsg);
      // --- End Error Handling ---
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      name: ''
    });
    setError('');
  };

  return (
    <div className="app-container">
      
      <div className="title-section">
        <h1>
          <span className="typing-effect">Welcome to GED Platform</span>
        </h1>
        <p>Your journey starts here.</p>
      </div>
      
      <div className="card-container">
        <div className={`card ${isLogin ? '' : 'is-flipped'}`}>
          {/* Login  */}
          <div className="card-front">
            <div className="card-content">
              <h2>Login</h2>
              
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                />
                
                <button type="submit">Login</button>
              </form>

              <p className="toggle-link" onClick={toggleForm}>
                Don't have an account? Sign Up
              </p>
            </div>
          </div>

          {/* Signup */}
          <div className="card-back">
            <div className="card-content">
              <h2>Sign Up</h2>
              
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />

                <div className="name-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Hidden name field that gets populated automatically */}
                <input
                  type="hidden"
                  name="name"
                  value={formData.name}
                />
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                />
                
                <button type="submit">Sign Up</button>
              </form>

              <p className="toggle-link" onClick={toggleForm}>
                Already have an account? Login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;