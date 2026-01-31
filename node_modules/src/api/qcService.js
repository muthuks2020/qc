// QC Service - API calls for Quality Control operations
// Configurable API approach - toggle between mock and real API

import { API_CONFIG, ENDPOINTS, buildEndpoint } from './config';
import { mockPendingJobs, mockJobDetails, mockDashboardStats } from './mockData';

// ============================================
// API Configuration Object
// Toggle between mock and real API
// ============================================
export const QC_API_CONFIG = {
  useMockData: true, // Set to false when API is ready
  logApiCalls: true, // Enable for debugging
};

// Simulate API delay for mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// HTTP Client Helper
// ============================================
const apiClient = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Request:', { url, ...config });
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (QC_API_CONFIG.logApiCalls) {
      console.log('[QC API] Response:', data);
    }
    
    return data;
  } catch (error) {
    console.error('[QC API] Error:', error);
    throw error;
  }
};

// ============================================
// API Service Functions
// ============================================

/**
 * Fetch all pending QC jobs from Odoo
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of pending QC jobs
 */
export const fetchPendingJobs = async (filters = {}) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Fetching pending jobs with filters:', filters);
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(500);
    let jobs = [...mockPendingJobs];
    
    if (filters.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    if (filters.priority) {
      jobs = jobs.filter(job => job.priority === filters.priority);
    }
    
    return jobs;
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.PENDING_JOBS);
  const queryParams = new URLSearchParams(filters).toString();
  return apiClient(`${url}?${queryParams}`);
};

/**
 * Fetch detailed information for a specific QC job
 * @param {string} jobId - The QC job ID
 * @returns {Promise<Object>} Job details with checkpoints
 */
export const fetchJobDetails = async (jobId) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Fetching job details:', jobId);
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(300);
    const job = mockJobDetails[jobId];
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    return job;
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.JOB_DETAILS, { id: jobId });
  return apiClient(url);
};

/**
 * Submit inspection results
 * @param {string} jobId - The QC job ID
 * @param {Object} results - Inspection results with checkpoints data
 * @returns {Promise<Object>} Submission response
 */
export const submitInspection = async (jobId, results) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Submitting inspection:', { jobId, results });
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(800);
    console.log('Submitting inspection:', { jobId, results });
    
    return {
      success: true,
      message: 'Inspection submitted successfully',
      jobId,
      timestamp: new Date().toISOString(),
    };
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.SUBMIT_INSPECTION, { id: jobId });
  return apiClient(url, {
    method: 'POST',
    body: JSON.stringify(results),
  });
};

/**
 * Save inspection as draft
 * @param {string} jobId - The QC job ID
 * @param {Object} data - Draft data including checkpoints
 * @returns {Promise<Object>} Save response
 */
export const saveDraft = async (jobId, data) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Saving draft:', { jobId, data });
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(300);
    console.log('Saving draft:', { jobId, data });
    
    return {
      success: true,
      message: 'Draft saved',
      jobId,
    };
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.SAVE_DRAFT, { id: jobId });
  return apiClient(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Fetch dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const fetchDashboardStats = async () => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Fetching dashboard stats');
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(400);
    return mockDashboardStats;
  }

  // Real API implementation
  const url = `${API_CONFIG.BASE_URL}/qc/dashboard/stats`;
  return apiClient(url);
};

/**
 * Update QC result in Odoo
 * @param {string} grnNo - GRN number
 * @param {Object} result - QC result (accepted/rejected quantities)
 * @returns {Promise<Object>} Odoo update response
 */
export const updateOdooQCResult = async (grnNo, result) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Updating Odoo:', { grnNo, result });
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(600);
    console.log('Updating Odoo:', { grnNo, result });
    
    return {
      success: true,
      message: 'Odoo updated successfully',
      grnNo,
    };
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.ODOO_UPDATE_QC);
  return apiClient(url, {
    method: 'POST',
    body: JSON.stringify({ grnNo, result }),
  });
};

/**
 * Update a single sample measurement
 * @param {string} jobId - The QC job ID
 * @param {number} checkpointId - The checkpoint ID
 * @param {number} sampleIndex - The sample index
 * @param {Object} sampleData - Sample data { status, measuredValue }
 * @returns {Promise<Object>} Update response
 */
export const updateSampleMeasurement = async (jobId, checkpointId, sampleIndex, sampleData) => {
  if (QC_API_CONFIG.logApiCalls) {
    console.log('[QC API] Updating sample:', { jobId, checkpointId, sampleIndex, sampleData });
  }

  if (QC_API_CONFIG.useMockData) {
    await delay(100);
    return {
      success: true,
      message: 'Sample updated',
      data: sampleData,
    };
  }

  // Real API implementation
  const url = `${API_CONFIG.BASE_URL}/qc/jobs/${jobId}/checkpoints/${checkpointId}/samples/${sampleIndex}`;
  return apiClient(url, {
    method: 'PATCH',
    body: JSON.stringify(sampleData),
  });
};
