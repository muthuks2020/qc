/**
 * Component Master API Service
 * Handles all API calls for Component Master CRUD operations
 * 
 * Configuration:
 * - Set USE_MOCK_DATA to false when backend API is ready
 * - Update API_BASE_URL with your backend endpoint
 */

// ============================================
// CONFIGURATION - Toggle between Mock and Real API
// ============================================
const USE_MOCK_DATA = true;  // Set to false when backend is ready
const API_BASE_URL = '/api/v1/component-master';

// ============================================
// MOCK DATA
// ============================================
const mockProductGroups = {
  mechanical: ['Housings', 'Frames', 'Casings', 'Brackets', 'Enclosures'],
  electrical: ['Cables', 'Connectors', 'Switches', 'Transformers', 'Motors'],
  plastic: ['Covers', 'Panels', 'Lenses', 'Buttons', 'Gaskets'],
  electronics: ['PCB Assembly', 'Display Modules', 'Sensors', 'Controllers', 'Power Units'],
  optical: ['Lenses', 'Mirrors', 'Filters', 'Prisms', 'Light Guides'],
};

const mockSamplingPlans = [
  { id: 'SP-001', name: 'Critical Components - Level I', aqlLevel: 'Level I' },
  { id: 'SP-002', name: 'Electrical Assembly - Level II', aqlLevel: 'Level II' },
  { id: 'SP-003', name: 'Visual Inspection - Standard', aqlLevel: 'Level III' },
  { id: 'SP-004', name: 'High-Precision Parts', aqlLevel: 'Special S-3' },
  { id: 'SP-005', name: 'General Inspection', aqlLevel: 'Level I' },
];

const mockQCPlans = [
  { id: 'RD.7.3-01', name: 'B-SCAN Probe QC Plan' },
  { id: 'RD.7.3-02', name: 'Display Module QC Plan' },
  { id: 'RD.7.3-03', name: 'Cable Assembly QC Plan' },
  { id: 'RD.7.3-04', name: 'Enclosure QC Plan' },
  { id: 'RD.7.3-05', name: 'Power Supply QC Plan' },
  { id: 'RD.7.3-06', name: 'PCB Assembly QC Plan' },
  { id: 'RD.7.3-07', name: 'Optical Components QC Plan' },
];

const mockComponents = [
  {
    id: 'COMP-001',
    productCategory: 'electronics',
    productGroup: 'Display Modules',
    partCode: 'BSC-DM-001',
    partName: 'LCD Display Panel 7"',
    qcPlanNo: 'RD.7.3-02',
    inspectionType: 'sampling',
    samplingPlan: 'SP-002',
    drawingNo: 'DWG-DM-001-R2',
    drawingAttachment: null,
    testCertRequired: true,
    specRequired: true,
    fqirRequired: false,
    prProcessCode: 'direct_purchase',
    checkingParameters: {
      type: 'visual',
      parameters: [
        { id: 1, checkingPoint: 'Screen Surface', unit: 'mm', specification: 'No scratches or cracks', instrumentName: '', toleranceMin: '', toleranceMax: '' },
        { id: 2, checkingPoint: 'Display Color', unit: 'units', specification: 'Uniform brightness', instrumentName: '', toleranceMin: '', toleranceMax: '' },
      ],
    },
    status: 'active',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-28T14:20:00Z',
  },
  {
    id: 'COMP-002',
    productCategory: 'electrical',
    productGroup: 'Cables',
    partCode: 'BSC-CB-002',
    partName: 'Probe Cable Assembly',
    qcPlanNo: 'RD.7.3-03',
    inspectionType: '100%',
    samplingPlan: null,
    drawingNo: 'DWG-CB-002-R1',
    drawingAttachment: null,
    testCertRequired: true,
    specRequired: true,
    fqirRequired: true,
    prProcessCode: 'external_job_work',
    checkingParameters: {
      type: 'functional',
      parameters: [
        { id: 1, checkingPoint: 'Continuity', unit: 'Ω', specification: '< 0.5 Ohm', instrumentName: 'Multimeter', toleranceMin: '0', toleranceMax: '0.5' },
        { id: 2, checkingPoint: 'Cable Length', unit: 'mm', specification: '2500mm', instrumentName: 'Measuring Tape', toleranceMin: '2450', toleranceMax: '2550' },
      ],
    },
    status: 'active',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-25T11:45:00Z',
  },
  {
    id: 'COMP-003',
    productCategory: 'mechanical',
    productGroup: 'Casings',
    partCode: 'BSC-CS-003',
    partName: 'B-SCAN Main Housing',
    qcPlanNo: 'RD.7.3-04',
    inspectionType: 'sampling',
    samplingPlan: 'SP-001',
    drawingNo: 'DWG-CS-003-R3',
    drawingAttachment: null,
    testCertRequired: false,
    specRequired: true,
    fqirRequired: false,
    prProcessCode: 'internal_job_work',
    checkingParameters: {
      type: 'functional',
      parameters: [
        { id: 1, checkingPoint: 'Length', unit: 'mm', specification: '250mm', instrumentName: 'Vernier Caliper', toleranceMin: '249.5', toleranceMax: '250.5' },
        { id: 2, checkingPoint: 'Width', unit: 'mm', specification: '180mm', instrumentName: 'Vernier Caliper', toleranceMin: '179.5', toleranceMax: '180.5' },
        { id: 3, checkingPoint: 'Weight', unit: 'g', specification: '450g', instrumentName: 'Digital Scale', toleranceMin: '440', toleranceMax: '460' },
      ],
    },
    status: 'active',
    createdAt: '2026-01-05T08:15:00Z',
    updatedAt: '2026-01-30T16:30:00Z',
  },
  {
    id: 'COMP-004',
    productCategory: 'optical',
    productGroup: 'Lenses',
    partCode: 'BSC-OL-004',
    partName: 'Ultrasound Coupling Lens',
    qcPlanNo: 'RD.7.3-07',
    inspectionType: '100%',
    samplingPlan: null,
    drawingNo: 'DWG-OL-004-R1',
    drawingAttachment: null,
    testCertRequired: true,
    specRequired: true,
    fqirRequired: true,
    prProcessCode: 'direct_purchase',
    checkingParameters: {
      type: 'visual',
      parameters: [
        { id: 1, checkingPoint: 'Clarity', unit: 'units', specification: 'Clear, no cloudiness', instrumentName: '', toleranceMin: '', toleranceMax: '' },
        { id: 2, checkingPoint: 'Surface', unit: 'units', specification: 'No scratches', instrumentName: '', toleranceMin: '', toleranceMax: '' },
      ],
    },
    status: 'draft',
    createdAt: '2026-01-28T13:00:00Z',
    updatedAt: '2026-01-28T13:00:00Z',
  },
];

// Local storage for mock data operations
let componentsData = [...mockComponents];

// ============================================
// HELPER FUNCTIONS
// ============================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => {
  const num = componentsData.length + 1;
  return `COMP-${String(num).padStart(3, '0')}`;
};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all product categories
 */
export const getProductCategories = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return [
      { id: 'mechanical', name: 'Mechanical', icon: '⚙️' },
      { id: 'electrical', name: 'Electrical', icon: '⚡' },
      { id: 'plastic', name: 'Plastic', icon: '🧪' },
      { id: 'electronics', name: 'Electronics', icon: '🔌' },
      { id: 'optical', name: 'Optical', icon: '🔍' },
    ];
  }
  
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

/**
 * Get product groups by category
 */
export const getProductGroups = async (category) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockProductGroups[category] || [];
  }
  
  const response = await fetch(`${API_BASE_URL}/product-groups?category=${category}`);
  if (!response.ok) throw new Error('Failed to fetch product groups');
  return response.json();
};

/**
 * Get all sampling plans
 */
export const getSamplingPlans = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockSamplingPlans;
  }
  
  const response = await fetch(`${API_BASE_URL}/sampling-plans`);
  if (!response.ok) throw new Error('Failed to fetch sampling plans');
  return response.json();
};

/**
 * Get all QC plans
 */
export const getQCPlans = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockQCPlans;
  }
  
  const response = await fetch(`${API_BASE_URL}/qc-plans`);
  if (!response.ok) throw new Error('Failed to fetch QC plans');
  return response.json();
};

/**
 * Get all components with optional filters
 */
export const getComponents = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    await delay(400);
    let filtered = [...componentsData];
    
    if (filters.category) {
      filtered = filtered.filter(c => c.productCategory === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.partName.toLowerCase().includes(search) ||
        c.partCode.toLowerCase().includes(search)
      );
    }
    
    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: 10,
    };
  }
  
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/components?${params}`);
  if (!response.ok) throw new Error('Failed to fetch components');
  return response.json();
};

/**
 * Get single component by ID
 */
export const getComponentById = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    const component = componentsData.find(c => c.id === id);
    if (!component) throw new Error('Component not found');
    return component;
  }
  
  const response = await fetch(`${API_BASE_URL}/components/${id}`);
  if (!response.ok) throw new Error('Failed to fetch component');
  return response.json();
};

/**
 * Create new component
 */
export const createComponent = async (data) => {
  if (USE_MOCK_DATA) {
    await delay(500);
    const newComponent = {
      ...data,
      id: generateId(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    componentsData.push(newComponent);
    return newComponent;
  }
  
  const response = await fetch(`${API_BASE_URL}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create component');
  return response.json();
};

/**
 * Update existing component
 */
export const updateComponent = async (id, data) => {
  if (USE_MOCK_DATA) {
    await delay(500);
    const index = componentsData.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Component not found');
    
    componentsData[index] = {
      ...componentsData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return componentsData[index];
  }
  
  const response = await fetch(`${API_BASE_URL}/components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update component');
  return response.json();
};

/**
 * Delete component
 */
export const deleteComponent = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(400);
    const index = componentsData.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Component not found');
    componentsData.splice(index, 1);
    return { success: true };
  }
  
  const response = await fetch(`${API_BASE_URL}/components/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete component');
  return response.json();
};

/**
 * Upload file attachment
 */
export const uploadAttachment = async (file, componentId, fieldName) => {
  if (USE_MOCK_DATA) {
    await delay(800);
    // Simulate file upload
    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: URL.createObjectURL(file),
    };
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('componentId', componentId);
  formData.append('fieldName', fieldName);
  
  const response = await fetch(`${API_BASE_URL}/attachments`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload file');
  return response.json();
};

/**
 * Validate part code uniqueness
 */
export const validatePartCode = async (partCode, excludeId = null) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    const exists = componentsData.some(
      c => c.partCode.toLowerCase() === partCode.toLowerCase() && c.id !== excludeId
    );
    return { isUnique: !exists };
  }
  
  const response = await fetch(`${API_BASE_URL}/validate-part-code?code=${partCode}&exclude=${excludeId || ''}`);
  if (!response.ok) throw new Error('Failed to validate part code');
  return response.json();
};

// Export configuration for external access
export const API_CONFIG = {
  USE_MOCK_DATA,
  API_BASE_URL,
};
