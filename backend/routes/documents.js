const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
} = require('../controllers/documents');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router
  .route('/')
  .get(protect, getDocuments)
  .post(protect, upload.single('file'), createDocument);

router
  .route('/:id')
  .get(protect, getDocument)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

router.route('/:id/share').post(protect, shareDocument);

module.exports = router;