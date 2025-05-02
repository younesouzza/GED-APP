import { useState, useEffect } from "react";
import "./filesPage.css";
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import documentService from "../../../services/documment"; // Import the document service

export default function FilesPage() {
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "", description: "" });
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("descending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAllDocuments();
      
      // Map backend document structure to frontend file structure
      const mappedFiles = response.data.data.map(doc => ({
        id: doc._id,
        title: doc.title,
        description: doc.description || "",
        date: new Date(doc.createdAt).toLocaleString(),
        size: `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB`,
        type: doc.documentType,
        filePath: doc.filePath,
        fileName: doc.fileName,
        classification: doc.classification
      }));
      
      setFiles(mappedFiles);
      setError(null);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (fileId) => {
    setSelectedFile(selectedFile === fileId ? null : fileId);
  };

  const handleDeleteFile = async (fileId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }
    
    try {
      await documentService.deleteDocument(fileId);
      setFiles(files.filter(file => file.id !== fileId));
      if (selectedFile === fileId) {
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleEditClick = (file, e) => {
    e.stopPropagation();
    setEditFormData({ 
      title: file.title,
      description: file.description || "" 
    });
    setShowEditModal(true);
    setSelectedFile(file.id);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await documentService.updateDocument(selectedFile, editFormData);
      
      // Update local state
      setFiles(files.map(file => 
        file.id === selectedFile 
          ? { ...file, title: editFormData.title, description: editFormData.description } 
          : file
      ));
      
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating document:", err);
      alert("Failed to update file. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "ascending" ? "descending" : "ascending");
    } else {
      setSortField(field);
      setSortDirection("descending");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Filter files based on search term and file type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || file.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort files based on sort field and direction
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === "ascending" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "name") {
      return sortDirection === "ascending" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortField === "size") {
      const sizeA = parseFloat(a.size);
      const sizeB = parseFloat(b.size);
      return sortDirection === "ascending" ? sizeA - sizeB : sizeB - sizeA;
    }
    return 0;
  });

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return <ArticleIcon className="fileTypeIcon document" />;
      case "image":
        return <ImageIcon className="fileTypeIcon image" />;
      case "video":
        return <VideoFileIcon className="fileTypeIcon video" />;
      case "spreadsheet":
        return <TableChartIcon className="fileTypeIcon spreadsheet" />;
      case "presentation":
        return <SlideshowIcon className="fileTypeIcon presentation" />;
      default:
        return <DescriptionIcon className="fileTypeIcon" />;
    }
  };

  if (loading) {
    return <div className="loading">Loading files...</div>;
  }

  return (
    <div className="filepage">
      <div className="gallery-header">
        <div className="gallery-title">
          <h1>Personal Gallery</h1>
        </div>
        <div className="gallery-actions">
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="gallery-toolbar">
        <div className="view-options">
          <button 
            className={`view-option ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <GridViewIcon />
            <span>Grid</span>
          </button>
          <button 
            className={`view-option ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <ViewListIcon />
            <span>List</span>
          </button>
        </div>

        <div className="sort-options">
          <div className="sort-dropdown">
            <button className="sort-button">
              {sortField === "date" ? "Date" : sortField === "name" ? "Name" : "Size"}
              <SortIcon />
            </button>
            <div className="sort-dropdown-content">
              <button onClick={() => handleSortChange("date")}>Date</button>
              <button onClick={() => handleSortChange("name")}>Name</button>
              <button onClick={() => handleSortChange("size")}>Size</button>
            </div>
          </div>
          <button className="sort-direction" onClick={() => setSortDirection(prev => prev === "ascending" ? "descending" : "ascending")}>
            {sortDirection === "ascending" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            {sortDirection === "ascending" ? "Ascending" : "Descending"}
          </button>
        </div>

        <div className="filter-options">
          <select 
            className="filter-dropdown"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="all">All Files</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className={`files-gallery ${viewMode}`}>
        {sortedFiles.map((file) => (
          <div 
            key={file.id}
            className={`gallery-item ${selectedFile === file.id ? "selected" : ""}`}
            onClick={() => handleSelectFile(file.id)}
          >
            <div className="file-thumbnail">
              {getFileIcon(file.type)}
            </div>
            <div className="file-info">
              <h3 className="file-title">{file.title}</h3>
              {file.description && <p className="file-description">{file.description}</p>}
              <div className="file-details">
                <span className="file-size">{file.size}</span>
                <span className="file-date">{file.date}</span>
                <span className="file-classification">{file.classification}</span>
              </div>
            </div>
            <div className="file-actions">
              <button className="action-btn edit" onClick={(e) => handleEditClick(file, e)}>
                <EditIcon fontSize="small" />
              </button>
              <button className="action-btn delete" onClick={(e) => handleDeleteFile(file.id, e)}>
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedFiles.length === 0 && !loading && (
        <div className="no-files">
          <p>No files found</p>
          {filterType !== "all" && <p>Try changing your filter or search terms</p>}
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit File</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="title">File Name</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}