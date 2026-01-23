// API Configuration - Replace with actual Odoo API endpoints
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  ODOO_URL: process.env.REACT_APP_ODOO_URL || 'http://localhost:8069',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  // GRN & QC Jobs
  PENDING_JOBS: '/qc/pending-jobs',
  JOB_DETAILS: '/qc/jobs/:id',
  SUBMIT_INSPECTION: '/qc/jobs/:id/submit',
  
  // Master Data
  PRODUCTS: '/master/products',
  SUPPLIERS: '/master/suppliers',
  PARAMETERS: '/master/parameters',
  
  // Odoo Integration
  ODOO_GRN: '/odoo/grn',
  ODOO_PO: '/odoo/purchase-orders',
  ODOO_UPDATE_QC: '/odoo/update-qc-result',
};
