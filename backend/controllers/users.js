const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @route   GET /api/users/me
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;

  // Check if user is requesting their own profile or admin
  if (req.params.id && req.user.id !== req.params.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this user profile');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${userId}`);
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @route   PUT /api/users/me
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;

  // Check if user is updating their own profile or admin
  if (req.params.id && req.user.id !== req.params.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this user profile');
  }

  let user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${userId}`);
  }

  // Check if username is being updated and if it's already taken
  if (req.body.username && req.body.username !== user.username) {
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) {
      res.status(400);
      throw new Error('Username already exists');
    }
  }

  // Check if email is being updated and if it's already taken
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  // Remove password from req.body if included
  const { password, ...updateData } = req.body;

  user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate request body
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if file exists
  if (!req.files || !req.files.avatar) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const file = req.files.avatar;

  // Make sure the file is an image
  if (!file.mimetype.startsWith('image')) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    res.status(400);
    throw new Error('Image size should be less than 2MB');
  }

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../public/uploads/avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create custom filename
  file.name = `avatar-${user._id}${path.parse(file.name).ext}`;

  // Delete old avatar if exists (except default)
  if (user.avatar && user.avatar !== 'default.jpg') {
    const oldAvatarPath = path.join(uploadDir, user.avatar);
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  // Upload file
  file.mv(`${uploadDir}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      res.status(500);
      throw new Error('Problem with file upload');
    }

    // Update user avatar field in database
    await User.findByIdAndUpdate(req.user.id, { avatar: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc    Get user avatar
// @route   GET /api/users/avatar
// @access  Private
exports.getAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // If user has no avatar, return default
  const avatarName = user.avatar || 'default.jpg';
  const avatarPath = path.join(__dirname, `../public/uploads/avatars/${avatarName}`);

  // Check if file exists
  if (!fs.existsSync(avatarPath)) {
    res.status(404);
    throw new Error('Avatar not found');
  }

  res.sendFile(avatarPath);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found with id of ${req.params.id}`);
  }

  // Remove user avatar if exists
  if (user.avatar && user.avatar !== 'default.jpg') {
    const avatarPath = path.join(__dirname, `../public/uploads/avatars/${user.avatar}`);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});