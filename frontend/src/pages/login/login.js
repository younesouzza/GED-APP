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
      
      // Create data object based on form type
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
          return;
        }
        
        // Create a valid name if not already set
        let name = formData.name;
        if (!name || name.trim() === '') {
          if (formData.firstName || formData.lastName) {
            name = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
          } else {
            name = formData.username; // Use username as fallback for name
          }
        }
        
        submitData = {
          username: formData.username,
          name: name,
          email: formData.email,
          password: formData.password
        };
      }
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, submitData);
      
      localStorage.setItem('token', response.data.data.token);
      console.log('Response:', response.data);
      console.log('Token stored:', response.data.data.token);
      
      alert(isLogin ? 'Login Successful!' : 'Sign Up Successful!');
      
      // Navigate to dashboard after successful login/signup
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'invalid Email or Password';
      setError(errorMsg);
      console.error('Authentication error:', error);
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