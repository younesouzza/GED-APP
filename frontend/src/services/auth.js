// services/auth.js
import api from './api';

/**
 * Authentication Service - Handles all auth-related API operations
 */
class AuthService {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials (email/password)
   * @returns {Promise} API response with token and user data
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials); // Ensure '/api' prefix is handled by baseURL or added here if needed

      // Store token and user ID in local storage upon successful login
      // Backend sends token and user details nested under 'data'
      if (response.data?.success && response.data?.data?.token) {
        const token = response.data.data.token;
        const userId = response.data.data._id; // Get _id from nested data object

        localStorage.setItem('token', token);
        if (userId) {
          localStorage.setItem("userId", userId);
          console.log("AuthService: Token and UserID stored.");
        } else {
          console.error("AuthService Error: User ID not found in login response data:", response.data.data);
          // Handle case where ID might be missing - perhaps clear token?
          localStorage.removeItem('token');
          throw new Error("Login successful, but user ID was missing.");
        }
      } else {
        // Handle cases where login wasn't successful according to backend structure
         console.error("AuthService Error: Token or success flag missing in login response:", response.data);
         throw new Error(response.data?.message || "Login failed: Invalid response structure.");
      }

      return response.data; // Return the full response data
    } catch (error) {
       console.error("AuthService Login Error:", error.response?.data?.error || error.message);
      // Re-throw the error so the component can catch it
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response with registration result
   */
  async register(userData) {
    try {
      // Assuming '/api/auth/register' is the correct endpoint
      const response = await api.post('/auth/register', userData); // Ensure '/api' prefix is handled by baseURL or added here if needed
      // Registration might also return a token and user data, handle similarly to login if needed
      // For now, just return the response data
       if (!response.data?.success) {
         throw new Error(response.data?.message || "Registration failed.");
       }
      return response.data;
    } catch (error) {
      console.error("AuthService Register Error:", error.response?.data?.error || error.message);
      throw error;
    }
  }

  /**
   * Get current user profile using the /auth/me endpoint
   * @returns {Promise} API response with user data
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me'); // Ensure '/api' prefix is handled by baseURL or added here if needed
      // Backend returns { success: true, data: { user details } }
      if (response.data?.success) {
        return response.data.data; // Return only the user data object
      } else {
        throw new Error(response.data?.message || "Failed to fetch user data.");
      }
    } catch (error) {
       console.error("AuthService GetCurrentUser Error:", error.response?.data?.error || error.message);
      throw error;
    }
  }

  /**
   * Logout user - Remove token and user ID from storage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log("AuthService: User logged out.");
    // Optionally: redirect to login page or refresh window
    // window.location.href = '/login';
  }

  /**
   * Check if user is authenticated based on token presence
   * @returns {Boolean} True if authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    // Add a check for "null" or "undefined" strings which might be stored erroneously
    return !!token && token !== 'null' && token !== 'undefined';
  }
}

export default new AuthService();