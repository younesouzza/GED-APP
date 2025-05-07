// fixedApi.js - Create this file in your services directory
import axios from 'axios';

// Create axios instance with debugging
const api = axios.create({
  baseURL: 'http://localhost:5000',
  // Increase timeout for slower networks
  timeout: 15000
});

// Debug function for detailed request logging
const debugRequest = (config) => {
  console.group(`🚀 API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
  console.log('Headers:', JSON.stringify(config.headers, null, 2));
  
  // Only log body for non-GET requests with actual data
  if (config.method !== 'get' && config.data) {
    console.log('Request Body:', config.data);
  }
  
  // Log authentication status
  const authHeader = config.headers?.Authorization || config.headers?.authorization;
  console.log('Auth Header Present:', !!authHeader);
  if (authHeader) {
    console.log('Auth Header Format:', 
      authHeader.startsWith('Bearer ') ? 'Bearer token' : 'Other format');
    console.log('Auth Header Length:', authHeader.length);
  }
  
  console.groupEnd();
  return config;
};

// Debug response function for detailed response logging
const logResponse = (response) => {
  console.group(`✅ API Response: ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url}`);
  console.log('Status:', response.status);
  console.log('Response Data:', response.data);
  console.groupEnd();
  return response;
};

// Request interceptor with enhanced error handling
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from localStorage - with error handling
      let token;
      try {
        token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ No token found in localStorage for request:', config.url);
        }
      } catch (storageError) {
        console.error('❌ Error accessing localStorage:', storageError);
      }
      
      // Ensure headers object exists
      config.headers = config.headers || {};
      
      // Set content type if not already set and not multipart form data
      if (!config.headers['Content-Type'] && 
          !config.headers['content-type'] && 
          !String(config.headers['Content-Type']).includes('multipart')) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      // Add authorization header if token exists
      if (token) {
        // Check if token already includes 'Bearer' prefix
        if (token.startsWith('Bearer ')) {
          config.headers['Authorization'] = token;
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      return debugRequest(config);
    } catch (e) {
      console.error('❌ CRITICAL: Error in request interceptor:', e);
      return config; // Still try to continue with the request
    }
  },
  (error) => {
    console.error('❌ Request Preparation Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  logResponse,
  (error) => {
    console.group('❌ API Error');
    
    // Log request details
    if (error.config) {
      console.log('Request URL:', error.config.url);
      console.log('Request Method:', error.config.method?.toUpperCase() || 'GET');
      console.log('Request Headers:', error.config.headers);
    }
    
    // Log response details if available
    if (error.response) {
      console.log('Status Code:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Response Data:', error.response.data);
      
      // Special handling for auth errors
      if (error.response.status === 403) {
        console.warn('🚫 FORBIDDEN: Server rejected the request - likely an authentication issue');
        console.log('Verify token format and validity!');
        
        // Show token for debugging (redacted for security)
        const token = localStorage.getItem('token');
        if (token) {
          const firstChars = token.substring(0, 10);
          const lastChars = token.substring(token.length - 10);
          console.log(`Token: ${firstChars}...${lastChars} (${token.length} chars)`);
        }
      }
    } else if (error.request) {
      console.log('No response received. Server might be down or network issue.');
      console.log('Request details:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    console.groupEnd();
    return Promise.reject(error);
  }
);

// Optional: Direct fetch method as fallback
api.directFetch = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const url = `${api.defaults.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`🔄 Direct fetch to ${url}`, { headers });
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw { response: { status: response.status, data } };
    }
    
    return { data, status: response.status };
  } catch (error) {
    console.error('Direct fetch error:', error);
    throw error;
  }
};

export default api;