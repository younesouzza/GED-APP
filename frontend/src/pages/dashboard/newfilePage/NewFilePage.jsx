import { useState, useRef } from "react";
import "./NewFilePage.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function NewFilePage() {
  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    title: "",
    subject: "",
    description: "",
    classification: "",  
    documentType: ""     
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setFileDetails(prev => ({
        ...prev,
        title: fileName
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFileDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      
      const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
      setFileDetails(prev => ({
        ...prev,
        title: fileName
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!file) return alert("Please select a file to upload");
  
    const token = localStorage.getItem("token");
    console.log("Token being used:", token);

    if (!token) {
      alert("You must be logged in to upload files");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); 
    formData.append("title", fileDetails.title);
    formData.append("subject", fileDetails.subject);
    formData.append("description", fileDetails.description);
    formData.append("classification", fileDetails.classification);
    formData.append("documentType", fileDetails.documentType);     
  
    try {
      setIsUploading(true);
  
      const res = await axios.post(
        "http://localhost:5000/api/documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );
  
      console.log("Upload successful:", res.data);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload error status:", err.response?.status);
      console.error("Upload error message:", err.response?.data);
      alert(err.response?.data?.error || err.response?.data?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
      if (uploadSuccess) {
        setTimeout(() => {
          setFile(null);
          setFileDetails({
            title: "",
            subject: "",
            description: "",
            classification: "",
            documentType: ""
          });
          setUploadSuccess(false);
        }, 2000);
      }
    }
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="newFilePage">
      <div className="newFileHeader">
        <Link to="/dashboard/files" className="backButton">
          <ArrowBackIcon fontSize="small" />
          <span>Back to Files</span>
        </Link>
        <h1>Upload New File</h1>
      </div>

      <div className="uploadContainer">
        <div className="uploadCard">
          <form onSubmit={handleUpload}>
            <div 
              className={`dropZone ${isDragging ? 'dragging' : ''} ${file ? 'hasFile' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileSelector}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="fileInput"
              />
              
              {file ? (
                <div className="selectedFile">
                  <InsertDriveFileIcon fontSize="large" className="filePreviewIcon" />
                  <div className="fileInfo">
                    <span className="fileName">{file.name}</span>
                    <span className="fileSize">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              ) : (
                <div className="uploadInstructions">
                  <CloudUploadIcon fontSize="large" className="uploadIcon" />
                  <h3>Drag & Drop your file here</h3>
                  <p>or click to browse files</p>
                  <p className="supportedFormats">Supported formats: PDF, DOCX, TXT, JPG, PNG</p>
                </div>
              )}
            </div>

            <div className="formFields">
              <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={fileDetails.title}
                  onChange={handleInputChange}
                  placeholder="Enter file title"
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={fileDetails.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject "
                  required
                />
              </div>

              
              <div className="formGroup">
                <label htmlFor="documentType">Document Type*</label>
                <select
                  id="documentType"
                  name="documentType"
                  value={fileDetails.documentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Document Type</option>
                  <option value="Documents">Documents</option>
                  <option value="Images">Images</option>
                  <option value="Videos">Videos</option>
                  
                  <option value="Other">Other</option>
                </select>
              </div>

              
              <div className="formGroup">
                <label htmlFor="classification">Classification*</label>
                <select
                  id="classification"
                  name="classification"
                  value={fileDetails.classification}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Classification</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Confidential">Confidential</option>
                  
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={fileDetails.description}
                  onChange={handleInputChange}
                  placeholder="Add a description for this file"
                  rows="3"
                />
              </div>

              <div className="submitContainer">
                <button 
                  type="submit" 
                  className={`uploadButton ${isUploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
                  disabled={isUploading || uploadSuccess || !file}
                >
                  {uploadSuccess ? 'Upload Successful!' : isUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}