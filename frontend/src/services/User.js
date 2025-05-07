// services/User.js
import api from './api';

/**
 * User Service - Handles all user-related API operations for the logged-in user or admins
 */
class UserService {
  /**
   * Get current user profile
   * Use this instead of getUser('me') for clarity if '/auth/me' is preferred
   * Assumes '/auth/me' route exists and returns user data
   * @returns {Promise} API response with current user data
   */
   getCurrentUserProfile() {
     // Option 1: Use existing auth route if available
     return api.get('/auth/me');
     // Option 2: Use the users route
     // return api.get('/users/me');
   }


  /**
   * Get user profile (can be 'me' for current user or ID for admin)
   * @param {string} userId - User ID or 'me'
   * @returns {Promise} API response with user data
   */
  getUser(userId) {
    // Use template literal for clarity
    return api.get(`/users/${userId}`);
  }

  /**
   * Update user profile (can be 'me' for current user or ID for admin)
   * @param {string} userId - User ID or 'me'
   * @param {Object} userData - Updated user data (e.g., name, email, username)
   * @returns {Promise} API response with update result
   */
  updateUser(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  }

  /**
   * Update current user's password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise} API response with update result
   */
  updatePassword(passwordData) {
    // Calls the harmonized backend route: PUT /users/me/password
    return api.put(`/users/me/password`, passwordData);
  }

  /**
   * Upload current user's avatar
   * @param {FormData} formData - Form data with 'avatar' image file
   * @returns {Promise} API response with upload result
   */
  uploadAvatar(formData) {
     // Calls the harmonized backend route: PUT /users/me/avatar
    return api.put(`/users/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get avatar URL for the current logged-in user
   * @returns {string} URL to the current user's avatar
   */
  getAvatarUrl() {
    // Calls the harmonized backend route: GET /users/me/avatar
    // Add timestamp to prevent browser caching issues after upload
    return `${api.defaults.baseURL}/users/me/avatar?t=${new Date().getTime()}`;
  }

  // --- Admin Only Methods ---

  /**
   * Get all users (admin only)
   * @returns {Promise} API response with users data
   */
  getAllUsers() {
    // Note: Original service had '/users' - ensure backend route is '/api/users' if needed
    return api.get('/users'); // Or '/api/users' depending on base URL and router prefix
  }

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response with deletion result
   */
  deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  }
}

export default new UserService();