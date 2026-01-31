// Mock Data - Replace with actual Odoo API responses
// Enhanced with input types, QC file links, and measured values support

export const mockPendingJobs = [
  {
    id: 'QC-2025-001',
    grnNo: 'MES-25-IN-00041',
    grnDate: '2025-10-10',
    poNo: 'PH/HO-25-07725',
    irNo: 'SYN-0114',
    supplier: {
      code: 'SC001540',
      name: 'M/s Sri Sakthi Ganesh Casting Works, Chennai',
    },
    product: {
      code: 'DSYN-090-DP',
      name: 'Aluminium Casting Handle - DP',
      category: 'Raw Material',
    },
    lotSize: 60,
    sampleSize: 10,
    priority: 'high',
    status: 'pending',
    createdAt: '2025-10-10T08:30:00Z',
    dueDate: '2025-10-11T17:00:00Z',
  },
  {
    id: 'QC-2025-002',
    grnNo: 'MES-25-IN-00042',
    grnDate: '2025-10-10',
    poNo: 'PH/HO-25-07730',
    irNo: 'SYN-0115',
    supplier: {
      code: 'SC001542',
      name: 'Precision Components Pvt Ltd, Bangalore',
    },
    product: {
      code: 'AAT-9002',
      name: 'Phaco Handpiece Orbit',
      category: 'Finished Goods',
    },
    lotSize: 39,
    sampleSize: 39,
    priority: 'medium',
    status: 'pending',
    createdAt: '2025-10-10T09:15:00Z',
    dueDate: '2025-10-12T17:00:00Z',
  },
  {
    id: 'QC-2025-003',
    grnNo: 'MES-25-IN-00043',
    grnDate: '2025-10-09',
    poNo: 'PH/HO-25-07728',
    irNo: 'SYN-0113',
    supplier: {
      code: 'SC001538',
      name: 'Optical Lens Manufacturing Co., Pondicherry',
    },
    product: {
      code: 'IOL-5500',
      name: 'Intraocular Lens 21D',
      category: 'Finished Goods',
    },
    lotSize: 100,
    sampleSize: 20,
    priority: 'high',
    status: 'in_progress',
    createdAt: '2025-10-09T14:00:00Z',
    dueDate: '2025-10-10T17:00:00Z',
  },
  {
    id: 'QC-2025-004',
    grnNo: 'MES-25-IN-00040',
    grnDate: '2025-10-08',
    poNo: 'PH/HO-25-07720',
    irNo: 'SYN-0110',
    supplier: {
      code: 'SC001535',
      name: 'Steel Tubes India, Coimbatore',
    },
    product: {
      code: 'STL-3020',
      name: 'Stainless Steel Tube 3mm',
      category: 'Raw Material',
    },
    lotSize: 500,
    sampleSize: 50,
    priority: 'low',
    status: 'completed',
    createdAt: '2025-10-08T10:00:00Z',
    completedAt: '2025-10-08T16:30:00Z',
    passRate: 98,
  },
];

// Enhanced checkpoint structure with inputType and qcFileId
export const mockJobDetails = {
  'QC-2025-001': {
    id: 'QC-2025-001',
    grnNo: 'MES-25-IN-00041',
    poNo: 'PH/HO-25-07725',
    irNo: 'SYN-0114',
    irDate: '2025-10-10',
    supplier: {
      code: 'SC001540',
      name: 'M/s Sri Sakthi Ganesh Casting Works, Chennai',
    },
    product: {
      code: 'DSYN-090-DP',
      name: 'Aluminium Casting Handle - DP',
    },
    lotSize: 60,
    sampleSize: 10,
    qualityPlanNo: 'MQP-SYN-03',
    imteId: 'AT ELE 0102 (Vernier)',
    checkpoints: [
      { 
        id: 1, 
        name: 'Height', 
        instrument: 'Vernier', 
        spec: '94mm', 
        tolerance: '±0.5mm',
        // Enhanced fields
        inputType: 'measurement', // 'measurement' | 'yesno' | 'both'
        unit: 'mm',
        nominalValue: 94,
        upperLimit: 94.5,
        lowerLimit: 93.5,
        qcFileId: 'QC-FILE-001',
        qcFileUrl: '/files/qc-parameters/height-measurement.pdf',
        // Samples with both status and measured values
        samples: Array(10).fill(null).map(() => ({
          status: null, // 'OK' | 'NG' | null
          measuredValue: null, // number | null
        })),
      },
      { 
        id: 2, 
        name: 'Thickness-1', 
        instrument: 'Vernier', 
        spec: '29mm', 
        tolerance: '±0.3mm',
        inputType: 'measurement',
        unit: 'mm',
        nominalValue: 29,
        upperLimit: 29.3,
        lowerLimit: 28.7,
        qcFileId: 'QC-FILE-002',
        qcFileUrl: '/files/qc-parameters/thickness-1-measurement.pdf',
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
      { 
        id: 3, 
        name: 'Thickness-2', 
        instrument: 'Vernier', 
        spec: '12mm', 
        tolerance: '±0.2mm',
        inputType: 'measurement',
        unit: 'mm',
        nominalValue: 12,
        upperLimit: 12.2,
        lowerLimit: 11.8,
        qcFileId: 'QC-FILE-003',
        qcFileUrl: '/files/qc-parameters/thickness-2-measurement.pdf',
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
    ],
  },
  'QC-2025-002': {
    id: 'QC-2025-002',
    grnNo: 'MES-25-IN-00042',
    poNo: 'PH/HO-25-07730',
    irNo: 'SYN-0115',
    irDate: '2025-10-10',
    supplier: {
      code: 'SC001542',
      name: 'Precision Components Pvt Ltd, Bangalore',
    },
    product: {
      code: 'AAT-9002',
      name: 'Phaco Handpiece Orbit',
    },
    lotSize: 39,
    sampleSize: 39,
    qualityPlanNo: 'RD-7.3-07-A12',
    imteId: 'Visual & Jig-08',
    checkpoints: [
      { 
        id: 1, 
        name: 'Thread Condition Check', 
        instrument: 'Visual', 
        spec: 'No Damage', 
        tolerance: '-',
        inputType: 'yesno', // Yes/No only
        qcFileId: null,
        qcFileUrl: null,
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
      { 
        id: 2, 
        name: 'LuerLock Connector HP Check', 
        instrument: 'Visual', 
        spec: 'Proper Fit', 
        tolerance: '-',
        inputType: 'yesno',
        qcFileId: null,
        qcFileUrl: null,
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
      { 
        id: 3, 
        name: 'Irrigation Flow Checking', 
        instrument: 'Jig-08', 
        spec: 'Flow OK', 
        tolerance: '-',
        inputType: 'yesno',
        qcFileId: 'QC-FILE-FLOW',
        qcFileUrl: '/files/qc-parameters/irrigation-flow.pdf',
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
      { 
        id: 4, 
        name: 'Block in Irrigation Path', 
        instrument: 'Jig-08', 
        spec: 'No Block', 
        tolerance: '-',
        inputType: 'yesno',
        qcFileId: null,
        qcFileUrl: null,
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
      { 
        id: 5, 
        name: 'Quantity Verification', 
        instrument: 'Visual', 
        spec: '39 Nos', 
        tolerance: '-',
        inputType: 'both', // Both measurement and Yes/No
        unit: 'Nos',
        qcFileId: null,
        qcFileUrl: null,
        samples: Array(10).fill(null).map(() => ({
          status: null,
          measuredValue: null,
        })),
      },
    ],
  },
};

export const mockDashboardStats = {
  pendingJobs: 8,
  inProgress: 3,
  completedToday: 12,
  passRate: 97.5,
};

// Input type definitions
export const INPUT_TYPES = {
  MEASUREMENT: 'measurement', // Numeric input field only
  YESNO: 'yesno',             // Yes/No toggle only
  BOTH: 'both',               // Both measurement and Yes/No
};

// Helper to check if a measured value is within limits
export const isWithinLimits = (value, checkpoint) => {
  if (!checkpoint.upperLimit || !checkpoint.lowerLimit) {
    return null; // No limits defined
  }
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return null;
  }
  return numValue >= checkpoint.lowerLimit && numValue <= checkpoint.upperLimit;
};

// Helper to auto-determine status based on measured value
export const getStatusFromMeasuredValue = (value, checkpoint) => {
  const withinLimits = isWithinLimits(value, checkpoint);
  if (withinLimits === null) {
    return null;
  }
  return withinLimits ? 'OK' : 'NG';
};
