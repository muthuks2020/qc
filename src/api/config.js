// API Configuration - Centralized API settings and endpoints
// Replace with actual API endpoints when ready

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  ODOO_URL: process.env.REACT_APP_ODOO_URL || 'http://localhost:8069',
  QC_FILES_URL: process.env.REACT_APP_QC_FILES_URL || 'http://localhost:8000/files',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const ENDPOINTS = {
  // GRN & QC Jobs
  PENDING_JOBS: '/qc/pending-jobs',
  JOB_DETAILS: '/qc/jobs/:id',
  SUBMIT_INSPECTION: '/qc/jobs/:id/submit',
  SAVE_DRAFT: '/qc/jobs/:id/draft',
  
  // QC Files & Documents
  QC_FILE: '/qc/files/:fileId',
  QC_FILE_BY_CHECKPOINT: '/qc/checkpoints/:checkpointId/file',
  QC_FILE_BY_PRODUCT: '/qc/products/:productCode/qc-plan',
  QUALITY_PLAN: '/qc/quality-plans/:planNo',
  
  // Checkpoint Parameters
  CHECKPOINT_PARAMETERS: '/qc/checkpoints/:checkpointId/parameters',
  
  // Master Data
  PRODUCTS: '/master/products',
  SUPPLIERS: '/master/suppliers',
  PARAMETERS: '/master/parameters',
  INSTRUMENTS: '/master/instruments',
  
  // Odoo Integration
  ODOO_GRN: '/odoo/grn',
  ODOO_PO: '/odoo/purchase-orders',
  ODOO_UPDATE_QC: '/odoo/update-qc-result',
};

// API Response status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Helper function to build endpoint URLs
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return `${API_CONFIG.BASE_URL}${url}`;
};

// Helper function to build QC file URL
export const buildQCFileUrl = (fileId) => {
  return `${API_CONFIG.QC_FILES_URL}/${fileId}`;
};
