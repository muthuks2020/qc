/**
 * API Configuration
 * ==================
 * Central configuration for all API endpoints
 * 
 * HOW TO USE:
 * 1. For development: Keep USE_MOCK_DATA = true
 * 2. For production: Set USE_MOCK_DATA = false and update API_BASE_URL
 * 
 * ENVIRONMENT VARIABLES (Optional):
 * You can also use environment variables by creating a .env file:
 * REACT_APP_API_BASE_URL=https://your-api-server.com/api/v1
 * REACT_APP_USE_MOCK_DATA=false
 */

// ============================================
// MAIN CONFIGURATION
// ============================================

// Toggle between Mock and Real API
export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true;

// Base URL for API calls
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

// ============================================
// MODULE-SPECIFIC ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  // Component Master
  componentMaster: {
    base: `${API_BASE_URL}/component-master`,
    list: `${API_BASE_URL}/component-master/components`,
    create: `${API_BASE_URL}/component-master/components`,
    getById: (id) => `${API_BASE_URL}/component-master/components/${id}`,
    update: (id) => `${API_BASE_URL}/component-master/components/${id}`,
    delete: (id) => `${API_BASE_URL}/component-master/components/${id}`,
    duplicate: (id) => `${API_BASE_URL}/component-master/components/${id}/duplicate`,
    validatePartCode: `${API_BASE_URL}/component-master/validate-part-code`,
    categories: `${API_BASE_URL}/component-master/categories`,
    productGroups: `${API_BASE_URL}/component-master/product-groups`,
    samplingPlans: `${API_BASE_URL}/component-master/sampling-plans`,
    qcPlans: `${API_BASE_URL}/component-master/qc-plans`,
    upload: `${API_BASE_URL}/component-master/upload`,
  },
  
  // Gate Entry (for future use)
  gateEntry: {
    base: `${API_BASE_URL}/gate-entry`,
    list: `${API_BASE_URL}/gate-entry/entries`,
    create: `${API_BASE_URL}/gate-entry/entries`,
  },
  
  // GRN (for future use)
  grn: {
    base: `${API_BASE_URL}/grn`,
    list: `${API_BASE_URL}/grn/list`,
    create: `${API_BASE_URL}/grn`,
  },
  
  // QC Inspection (for future use)
  inspection: {
    base: `${API_BASE_URL}/inspection`,
    queue: `${API_BASE_URL}/inspection/queue`,
    visual: `${API_BASE_URL}/inspection/visual`,
    functional: `${API_BASE_URL}/inspection/functional`,
  },
};

// ============================================
// API REQUEST CONFIGURATION
// ============================================

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// ============================================
// PAGINATION DEFAULTS
// ============================================

export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48, 96],
};

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['.pdf', '.png', '.jpg', '.jpeg'],
  allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authorization headers
 * @returns {Object} Headers object with auth token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Get multipart form headers (for file uploads)
 * @returns {Object} Headers object without Content-Type (browser sets it)
 */
export const getMultipartHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Build query string from params object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
};

export default {
  USE_MOCK_DATA,
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  PAGINATION_CONFIG,
  FILE_UPLOAD_CONFIG,
  getAuthHeaders,
  getMultipartHeaders,
  buildQueryString,
};
