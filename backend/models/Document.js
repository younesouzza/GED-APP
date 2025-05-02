const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    documentType: {
      type: String,
      required: [true, 'Please specify document type'],
      enum: ['document', 'image', 'video', 'other'],  // Updated lowercase values
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classification: {
      type: String,
      required: [true, 'Please specify classification'],
      enum: ['Public', 'Private', 'Confidential'],
    },
    filePath: {
      type: String,
      required: [true, 'Please add a file path'],
    },
    fileType: {
      type: String,
      required: [true, 'Please add a file type'],
    },
    fileSize: {
      type: Number,
      required: [true, 'Please add a file size'],
    },
    fileName: {
      type: String,
      required: [true, 'Please add the original file name'],
    },
    receivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        receivedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);