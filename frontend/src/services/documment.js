import api from './api';

/**
 * Document Service - Handles all document-related API operations
 */
class DocumentService {
  /**
   * Get all documents
   * @returns {Promise} API response with documents data
   */
  getAllDocuments() {
    return api.get('/api/documents');
  }
  
  /**
   * Get a single document by ID
   * @param {string} id - Document ID
   * @returns {Promise} API response with document data
   */
  getDocument(id) {
    return api.get(`/api/documents/${id}`);
  }
  
  /**
   * Upload a new document
   * @param {FormData} formData - Form data containing file and metadata
   * @returns {Promise} API response with upload result
   */
  uploadDocument(formData) {
    return api.post('/api/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  /**
   * Update document metadata
   * @param {string} id - Document ID
   * @param {Object} data - Updated document data
   * @returns {Promise} API response with update result
   */
  updateDocument(id, data) {
    return api.put(`/api/documents/${id}`, data);
  }
  
  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise} API response with deletion result
   */
  deleteDocument(id) {
    return api.delete(`/api/documents/${id}`);
  }
  
  /**
   * Search for documents
   * @param {string} query - Search query
   * @returns {Promise} API response with search results
   */
  searchDocuments(query) {
    return api.get(`/api/documents/search?q=${query}`);
  }
  
  /**
   * Filter documents by type
   * @param {string} type - Document type to filter
   * @returns {Promise} API response with filtered documents
   */
  filterDocumentsByType(type) {
    return api.get(`/api/documents/filter?type=${type}`);
  }
  
  /**
   * Download a document
   * @param {string} id - Document ID
   * @returns {Promise} API response with file data
   */
  downloadDocument(id) {
    return api.get(`/api/documents/${id}/download`, {
      responseType: 'blob'
    });
  }
}

export default new DocumentService();