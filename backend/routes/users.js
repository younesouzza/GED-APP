// routes/users.js
const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  uploadAvatar,
  getAvatar
} = require('../controllers/users');

// Correctly require file upload middleware if needed for avatar upload
// Assuming you have a middleware setup similar to documents.js, e.g., using express-fileupload
// Make sure to install it: npm install express-fileupload
const fileUpload = require('express-fileupload'); // Add this if needed for uploadAvatar


const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Apply file upload middleware if your uploadAvatar controller uses req.files
// Adjust based on your actual avatar upload implementation in the controller
router.use(fileUpload()); // Apply globally to user routes OR apply specifically below

// Get all users - admin only
router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

// --- Routes for the currently logged-in user ---
router
  .route('/me')
  .get(protect, getUser)      // Get current user profile
  .put(protect, updateUser);   // Update current user profile (name, email, username etc.)

router
  .route('/me/password')
  .put(protect, updatePassword); // Update current user's password

router
  .route('/me/avatar')
  .put(protect, uploadAvatar)  // Update/Upload current user's avatar (changed from POST to PUT)
  .get(protect, getAvatar);    // Get current user's avatar

// --- Admin Routes for specific users ---
router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)     // Get specific user by ID
  .put(protect, authorize('admin'), updateUser)  // Update specific user by ID
  .delete(protect, authorize('admin'), deleteUser); // Delete specific user by ID

// Note: Removed previous standalone /updatepassword, /avatar, /avatar/:id routes
// The controller logic (getUser, updateUser, updatePassword, uploadAvatar, getAvatar)
// should primarily rely on req.user.id when accessed via /me routes.

module.exports = router;