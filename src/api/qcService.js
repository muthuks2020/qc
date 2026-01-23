// QC Service - API calls for Quality Control operations
// Replace mock implementations with actual API calls when ready

import { mockPendingJobs, mockJobDetails, mockDashboardStats } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all pending QC jobs from Odoo
 * @returns {Promise<Array>} List of pending QC jobs
 */
export const fetchPendingJobs = async (filters = {}) => {
  await delay(500); // Simulate network delay
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.PENDING_JOBS}`);
  // return response.json();
  
  let jobs = [...mockPendingJobs];
  
  // Apply filters
  if (filters.status) {
    jobs = jobs.filter(job => job.status === filters.status);
  }
  if (filters.priority) {
    jobs = jobs.filter(job => job.priority === filters.priority);
  }
  
  return jobs;
};

/**
 * Fetch detailed information for a specific QC job
 * @param {string} jobId - The QC job ID
 * @returns {Promise<Object>} Job details with checkpoints
 */
export const fetchJobDetails = async (jobId) => {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_CONFIG.BASE_URL}/qc/jobs/${jobId}`);
  // return response.json();
  
  const job = mockJobDetails[jobId];
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }
  return job;
};

/**
 * Submit inspection results
 * @param {string} jobId - The QC job ID
 * @param {Object} results - Inspection results
 * @returns {Promise<Object>} Submission response
 */
export const submitInspection = async (jobId, results) => {
  await delay(800);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_CONFIG.BASE_URL}/qc/jobs/${jobId}/submit`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(results),
  // });
  // return response.json();
  
  console.log('Submitting inspection:', { jobId, results });
  
  return {
    success: true,
    message: 'Inspection submitted successfully',
    jobId,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Save inspection as draft
 * @param {string} jobId - The QC job ID
 * @param {Object} data - Draft data
 * @returns {Promise<Object>} Save response
 */
export const saveDraft = async (jobId, data) => {
  await delay(300);
  
  // TODO: Replace with actual API call
  
  console.log('Saving draft:', { jobId, data });
  
  return {
    success: true,
    message: 'Draft saved',
    jobId,
  };
};

/**
 * Fetch dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const fetchDashboardStats = async () => {
  await delay(400);
  
  // TODO: Replace with actual API call
  
  return mockDashboardStats;
};

/**
 * Update QC result in Odoo
 * @param {string} grnNo - GRN number
 * @param {Object} result - QC result (accepted/rejected quantities)
 * @returns {Promise<Object>} Odoo update response
 */
export const updateOdooQCResult = async (grnNo, result) => {
  await delay(600);
  
  // TODO: Replace with actual Odoo API call
  // This will update the stock.picking or custom QC module in Odoo
  
  console.log('Updating Odoo:', { grnNo, result });
  
  return {
    success: true,
    message: 'Odoo updated successfully',
    grnNo,
  };
};
