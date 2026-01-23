// QC File Service - API calls for QC Files and Documents
// Configurable API approach - replace mock implementations with actual API calls

import { API_CONFIG, ENDPOINTS, buildEndpoint, buildQCFileUrl } from './config';

// Simulate API delay for mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// API Configuration Object
// Toggle between mock and real API
// ============================================
export const QC_FILE_API_CONFIG = {
  useMockData: true, // Set to false when API is ready
  logApiCalls: true, // Enable for debugging
};

// ============================================
// Mock Data for QC Files
// ============================================
const mockQCFiles = {
  'QC-FILE-001': {
    id: 'QC-FILE-001',
    name: 'Height Measurement Parameters',
    description: 'QC parameters for height measurement using Vernier caliper',
    documentUrl: '/files/qc-parameters/height-measurement.pdf',
    parameters: [
      { name: 'Nominal Value', value: '94mm' },
      { name: 'Upper Limit', value: '94.5mm' },
      { name: 'Lower Limit', value: '93.5mm' },
      { name: 'Measurement Points', value: '3' },
      { name: 'Instrument', value: 'Vernier Caliper' },
      { name: 'Accuracy', value: '±0.02mm' },
    ],
    revision: '1.2',
    lastUpdated: '2025-09-15',
  },
  'QC-FILE-002': {
    id: 'QC-FILE-002',
    name: 'Thickness-1 Measurement Parameters',
    description: 'QC parameters for thickness-1 measurement',
    documentUrl: '/files/qc-parameters/thickness-1-measurement.pdf',
    parameters: [
      { name: 'Nominal Value', value: '29mm' },
      { name: 'Upper Limit', value: '29.3mm' },
      { name: 'Lower Limit', value: '28.7mm' },
      { name: 'Measurement Points', value: '2' },
      { name: 'Instrument', value: 'Vernier Caliper' },
      { name: 'Accuracy', value: '±0.02mm' },
    ],
    revision: '1.0',
    lastUpdated: '2025-09-10',
  },
  'QC-FILE-003': {
    id: 'QC-FILE-003',
    name: 'Thickness-2 Measurement Parameters',
    description: 'QC parameters for thickness-2 measurement',
    documentUrl: '/files/qc-parameters/thickness-2-measurement.pdf',
    parameters: [
      { name: 'Nominal Value', value: '12mm' },
      { name: 'Upper Limit', value: '12.2mm' },
      { name: 'Lower Limit', value: '11.8mm' },
      { name: 'Measurement Points', value: '2' },
      { name: 'Instrument', value: 'Vernier Caliper' },
      { name: 'Accuracy', value: '±0.02mm' },
    ],
    revision: '1.1',
    lastUpdated: '2025-09-12',
  },
};

// Mapping checkpoint IDs to QC files
const checkpointToQCFileMap = {
  1: 'QC-FILE-001', // Height
  2: 'QC-FILE-002', // Thickness-1
  3: 'QC-FILE-003', // Thickness-2
};

// ============================================
// API Service Functions
// ============================================

/**
 * Fetch QC file details by file ID
 * @param {string} fileId - The QC file ID
 * @returns {Promise<Object>} QC file details
 */
export const fetchQCFile = async (fileId) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Fetching QC file:', fileId);
  }

  if (QC_FILE_API_CONFIG.useMockData) {
    await delay(300);
    const file = mockQCFiles[fileId];
    if (!file) {
      throw new Error(`QC File ${fileId} not found`);
    }
    return file;
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.QC_FILE, { fileId });
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch QC file: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetch QC file by checkpoint ID
 * @param {number} checkpointId - The checkpoint ID
 * @returns {Promise<Object>} QC file details
 */
export const fetchQCFileByCheckpoint = async (checkpointId) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Fetching QC file for checkpoint:', checkpointId);
  }

  if (QC_FILE_API_CONFIG.useMockData) {
    await delay(200);
    const fileId = checkpointToQCFileMap[checkpointId];
    if (!fileId) {
      return null; // No QC file linked to this checkpoint
    }
    return mockQCFiles[fileId];
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.QC_FILE_BY_CHECKPOINT, { checkpointId });
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null; // No QC file found
    }
    throw new Error(`Failed to fetch QC file: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetch QC file URL for a checkpoint
 * @param {number} checkpointId - The checkpoint ID
 * @returns {Promise<string|null>} QC file URL or null
 */
export const getQCFileUrl = async (checkpointId) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Getting QC file URL for checkpoint:', checkpointId);
  }

  if (QC_FILE_API_CONFIG.useMockData) {
    await delay(100);
    const fileId = checkpointToQCFileMap[checkpointId];
    if (!fileId) {
      return null;
    }
    const file = mockQCFiles[fileId];
    return file ? file.documentUrl : null;
  }

  // Real API implementation
  const file = await fetchQCFileByCheckpoint(checkpointId);
  return file ? file.documentUrl : null;
};

/**
 * Fetch checkpoint parameters (specifications, limits, etc.)
 * @param {number} checkpointId - The checkpoint ID
 * @returns {Promise<Array>} Array of parameters
 */
export const fetchCheckpointParameters = async (checkpointId) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Fetching parameters for checkpoint:', checkpointId);
  }

  if (QC_FILE_API_CONFIG.useMockData) {
    await delay(200);
    const fileId = checkpointToQCFileMap[checkpointId];
    if (!fileId) {
      return [];
    }
    const file = mockQCFiles[fileId];
    return file ? file.parameters : [];
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.CHECKPOINT_PARAMETERS, { checkpointId });
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch checkpoint parameters: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetch quality plan document
 * @param {string} planNo - The quality plan number
 * @returns {Promise<Object>} Quality plan details
 */
export const fetchQualityPlan = async (planNo) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Fetching quality plan:', planNo);
  }

  if (QC_FILE_API_CONFIG.useMockData) {
    await delay(300);
    // Return mock quality plan
    return {
      planNo,
      name: `Quality Plan ${planNo}`,
      documentUrl: `/files/quality-plans/${planNo}.pdf`,
      version: '1.0',
      effectiveDate: '2025-01-01',
      checkpoints: Object.values(mockQCFiles),
    };
  }

  // Real API implementation
  const url = buildEndpoint(ENDPOINTS.QUALITY_PLAN, { planNo });
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quality plan: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get all QC files for a list of checkpoints
 * @param {Array<number>} checkpointIds - Array of checkpoint IDs
 * @returns {Promise<Object>} Map of checkpoint ID to QC file
 */
export const fetchQCFilesForCheckpoints = async (checkpointIds) => {
  if (QC_FILE_API_CONFIG.logApiCalls) {
    console.log('[QC File API] Fetching QC files for checkpoints:', checkpointIds);
  }

  const results = {};
  
  for (const checkpointId of checkpointIds) {
    try {
      const file = await fetchQCFileByCheckpoint(checkpointId);
      if (file) {
        results[checkpointId] = file;
      }
    } catch (error) {
      console.error(`Failed to fetch QC file for checkpoint ${checkpointId}:`, error);
    }
  }
  
  return results;
};
