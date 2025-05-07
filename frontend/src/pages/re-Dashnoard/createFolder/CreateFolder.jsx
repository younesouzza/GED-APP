import {useState , useRef} from 'react'
import './createFolder.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from "react-router-dom";
import documentService from "../../../services/documment"; // Import the document service

export default function CreateFolder() {
    const navigate = useNavigate();
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
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        
        // Set the file title to the filename (without extension)
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
        
        // Set the file title to the filename (without extension)
        const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
        setFileDetails(prev => ({
          ...prev,
          title: fileName
        }));
      }
    };
  
    const handleUpload = async (e) => {
      e.preventDefault();
    
      if (!file) {
        setUploadError("Please select a file to upload");
        return;
      }
    
      // Reset error state
      setUploadError("");
  
      const formData = new FormData();
      formData.append("file", file); 
      formData.append("title", fileDetails.title);
      formData.append("subject", fileDetails.subject);
      formData.append("description", fileDetails.description);
      formData.append("classification", fileDetails.classification);
      formData.append("documentType", fileDetails.documentType);     
    
      try {
        setIsUploading(true);
    
        await documentService.uploadDocument(formData);
        
        setUploadSuccess(true);
        
        // Redirect after successful upload
        setTimeout(() => {
          navigate("/sd-dashboard/files");
        }, 2000);
        
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError(err.response?.data?.error || err.response?.data?.message || "Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
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
          <Link to="/sd-dashboard/files" className="backButton">
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
  
              {uploadError && <div className="errorMessage">{uploadError}</div>}
  
              <div className="formFields">
                <div className="formGroup">
                  <label htmlFor="title">Title*</label>
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
                  <label htmlFor="subject">Subject*</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={fileDetails.subject}
                    onChange={handleInputChange}
                    placeholder="Enter subject"
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
                    <option value="document">Documents</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="other">Other</option>
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