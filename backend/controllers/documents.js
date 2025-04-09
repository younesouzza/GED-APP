const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = asyncHandler(async (req, res) => {
  let query;

  // If admin, get all documents
  if (req.user.role === 'admin') {
    query = Document.find().populate({
      path: 'owner',
      select: 'name email',
    });
  } 
  // If reviewer, get documents they can review or own
  else if (req.user.role === 'reviewer') {
    query = Document.find({
      $or: [
        { owner: req.user._id },
        { 'receivedBy.user': req.user._id }
      ]
    }).populate({
      path: 'owner',
      select: 'name email',
    });
  }
  // Standard users - only their documents
  else {
    query = Document.find({ owner: req.user._id }).populate({
      path: 'owner',
      select: 'name email',
    });
  }

  const documents = await query;

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents,
  });
});

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id).populate({
    path: 'owner',
    select: 'name email',
  }).populate({
    path: 'receivedBy.user',
    select: 'name email',
  });

  if (!document) {
    res.status(404);
    throw new Error(`Document not found with id of ${req.params.id}`);
  }

  // Check if user is authorized to view this document
  if (
    req.user.role !== 'admin' && 
    document.owner._id.toString() !== req.user.id && 
    !document.receivedBy.some(item => item.user._id.toString() === req.user.id)
  ) {
    res.status(403);
    throw new Error('Not authorized to access this document');
  }

  res.status(200).json({
    success: true,
    data: document,
  });
});

// @desc    Create new document
// @route   POST /api/documents
// @access  Private
exports.createDocument = asyncHandler(async (req, res) => {
  // Add owner to req.body
  req.body.owner = req.user.id;
  
  // Check for uploaded file
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Create document with file info
  const document = await Document.create({
    ...req.body,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    fileName: req.file.originalname
  });

  res.status(201).json({
    success: true,
    data: document,
  });
});

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = asyncHandler(async (req, res) => {
  let document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error(`Document not found with id of ${req.params.id}`);
  }

  // Make sure user is document owner or admin
  if (document.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this document');
  }

  document = await Document.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: document,
  });
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error(`Document not found with id of ${req.params.id}`);
  }

  // Make sure user is document owner or admin
  if (document.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this document');
  }

  // Delete the file from the server
  const filePath = document.filePath;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await document.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Share document with user
// @route   POST /api/documents/:id/share
// @access  Private
exports.shareDocument = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    res.status(400);
    throw new Error('Please provide a user ID');
  }

  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error(`Document not found with id of ${req.params.id}`);
  }

  // Make sure user is document owner or admin
  if (document.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to share this document');
  }

  // Check if already shared with this user
  const alreadyShared = document.receivedBy.find(
    item => item.user.toString() === userId
  );

  if (alreadyShared) {
    res.status(400);
    throw new Error('Document already shared with this user');
  }

  document.receivedBy.push({ user: userId });
  
  await document.save();

  res.status(200).json({
    success: true,
    data: document,
  });
});