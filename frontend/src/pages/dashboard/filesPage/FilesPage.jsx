import { useState } from "react";
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

export default function FilesPage() {
  // Sample files data - in a real app, this would come from an API
  const [files, setFiles] = useState([
    { id: 1, title: "Project Proposal", date: "Apr 10, 2025, 04:30 PM", size: "2.44 MB", type: "document" },
    { id: 2, title: "Quarterly Report", date: "Apr 9, 2025, 12:15 PM", size: "1.22 MB", type: "spreadsheet" },
    { id: 3, title: "Team Photo", date: "Apr 8, 2025, 06:45 PM", size: "3.66 MB", type: "image" },
    { id: 4, title: "Product Presentation", date: "Apr 7, 2025, 11:30 AM", size: "4.88 MB", type: "presentation" },
    { id: 5, title: "Marketing Strategy", date: "Apr 6, 2025, 09:15 AM", size: "1.78 MB", type: "document" },
    { id: 6, title: "Budget Forecast", date: "Apr 5, 2025, 03:45 PM", size: "0.98 MB", type: "spreadsheet" }
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "" });
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("descending");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectFile = (fileId) => {
    setSelectedFile(selectedFile === fileId ? null : fileId);
  };

  const handleDeleteFile = (fileId, e) => {
    e.stopPropagation();
    setFiles(files.filter(file => file.id !== fileId));
    if (selectedFile === fileId) {
      setSelectedFile(null);
    }
  };

  const handleEditClick = (file, e) => {
    e.stopPropagation();
    setEditFormData({ title: file.title });
    setShowEditModal(true);
    setSelectedFile(file.id);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFiles(files.map(file => 
      file.id === selectedFile 
        ? { ...file, title: editFormData.title } 
        : file
    ));
    setShowEditModal(false);
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

  // Filter files based on search term
  const filteredFiles = files.filter(file => 
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      case "spreadsheet":
        return <TableChartIcon className="fileTypeIcon spreadsheet" />;
      case "image":
        return <ImageIcon className="fileTypeIcon image" />;
      case "presentation":
        return <SlideshowIcon className="fileTypeIcon presentation" />;
      default:
        return <DescriptionIcon className="fileTypeIcon" />;
    }
  };

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
          <select className="filter-dropdown">
            <option value="all">All Files</option>
            <option value="documents">Documents</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
          </select>
        </div>
      </div>

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
              <div className="file-details">
                <span className="file-size">{file.size}</span>
                <span className="file-date">{file.date}</span>
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

      {sortedFiles.length === 0 && (
        <div className="no-files">
          <p>No files found</p>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Rename File</h2>
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