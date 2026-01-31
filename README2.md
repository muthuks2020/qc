# Appasamy QC - Updated Inspection Module

## 🆕 What's New

This update enhances the inspection matrix with:

1. **Measurement Input Fields** - Numeric input fields for entering measured values (in addition to Yes/No toggles)
2. **QC File Links** - Clickable links below checkpoint names to view QC parameters
3. **Auto-Status Determination** - Automatically sets OK/NG based on measured values and limits
4. **Configurable API Approach** - Easy toggle between mock and real API
5. **Modular Code Structure** - Clean separation of concerns

---

## 📁 Updated Files

```
src/
├── api/
│   ├── config.js           # Enhanced with QC file endpoints
│   ├── mockData.js         # Enhanced checkpoint data with input types
│   ├── qcService.js        # Updated with configurable API toggle
│   ├── qcFileService.js    # NEW: QC file API service
│   └── index.js            # Updated exports
│
├── components/
│   └── inspection/
│       ├── InspectionMatrix.jsx  # Enhanced with input fields & QC links
│       └── index.js
│
└── pages/
    ├── InspectionPage.jsx  # Enhanced with measurement handling & QC modal
    └── index.js
```

---

## 🔧 Key Features

### 1. Measurement Input Fields

Each checkpoint can now have a numeric input field:

```jsx
// Input types supported:
inputType: 'measurement'  // Numeric input only
inputType: 'yesno'        // Yes/No toggle only  
inputType: 'both'         // Both measurement and Yes/No
```

**Features:**
- Color-coded borders (green = within limits, red = out of limits)
- Auto-focus and keyboard support (Enter to confirm)
- Placeholder shows unit (mm, Nos, etc.)

### 2. QC File Links

Below each checkpoint name, a "QC Parameters" link appears (if a QC file is linked):

```jsx
// Checkpoint with QC file
{
  id: 1,
  name: 'Height',
  qcFileId: 'QC-FILE-001',
  qcFileUrl: '/files/qc-parameters/height-measurement.pdf',
  ...
}
```

Clicking the link opens a modal with:
- QC file description
- Parameters table (nominal, limits, etc.)
- "View Full Document" button

### 3. Auto-Status Determination

When entering a measured value, the status (OK/NG) is automatically set:

```javascript
// If measured value is within limits → OK
// If measured value is outside limits → NG

// Example: Height checkpoint
upperLimit: 94.5  // mm
lowerLimit: 93.5  // mm

// User enters 94.2 → Auto-set to OK ✓
// User enters 95.0 → Auto-set to NG ✗
```

---

## 🔌 API Configuration

### Toggle Between Mock and Real API

**In `src/api/qcService.js`:**
```javascript
export const QC_API_CONFIG = {
  useMockData: true,  // Set to false when API is ready
  logApiCalls: true,  // Enable for debugging
};
```

**In `src/api/qcFileService.js`:**
```javascript
export const QC_FILE_API_CONFIG = {
  useMockData: true,  // Set to false when API is ready
  logApiCalls: true,
};
```

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/qc/files/:fileId` | GET | Get QC file details |
| `/qc/checkpoints/:checkpointId/file` | GET | Get QC file for checkpoint |
| `/qc/checkpoints/:checkpointId/parameters` | GET | Get checkpoint parameters |
| `/qc/quality-plans/:planNo` | GET | Get quality plan document |

---

## 📋 Data Structure Changes

### Enhanced Checkpoint Format

```javascript
// Old format
{
  id: 1,
  name: 'Height',
  instrument: 'Vernier',
  spec: '94mm',
  tolerance: '±0.5mm',
  samples: Array(10).fill(null),  // null | 'OK' | 'NG'
}

// New format
{
  id: 1,
  name: 'Height',
  instrument: 'Vernier',
  spec: '94mm',
  tolerance: '±0.5mm',
  
  // NEW: Input configuration
  inputType: 'measurement',       // 'measurement' | 'yesno' | 'both'
  unit: 'mm',                     // Display unit
  nominalValue: 94,               // Target value
  upperLimit: 94.5,               // Max acceptable
  lowerLimit: 93.5,               // Min acceptable
  
  // NEW: QC file reference
  qcFileId: 'QC-FILE-001',
  qcFileUrl: '/files/qc-parameters/height-measurement.pdf',
  
  // NEW: Enhanced samples format
  samples: Array(10).fill(null).map(() => ({
    status: null,           // 'OK' | 'NG' | null
    measuredValue: null,    // number | null
  })),
}
```

### Backward Compatibility

The code supports both old and new data formats:
- Old format: `samples: ['OK', 'NG', null, ...]`
- New format: `samples: [{ status: 'OK', measuredValue: 94.2 }, ...]`

---

## 🎯 Implementation Guide

### Step 1: Replace Files

Copy the updated files to your project:

```bash
# API files
cp src/api/*.js your-project/src/api/

# Component files  
cp src/components/inspection/InspectionMatrix.jsx your-project/src/components/inspection/

# Page files
cp src/pages/InspectionPage.jsx your-project/src/pages/
```

### Step 2: Update Imports

Ensure your API index exports the new service:

```javascript
// src/api/index.js
export * from './config';
export * from './qcService';
export * from './qcFileService';  // NEW
export * from './mockData';
```

### Step 3: Connect Real API

When your API is ready:

1. Set `useMockData: false` in both config objects
2. Implement the actual API endpoints
3. Update the endpoint URLs in `config.js`

---

## 🔄 API Integration Checklist

When connecting to real API:

- [ ] Set `QC_API_CONFIG.useMockData = false`
- [ ] Set `QC_FILE_API_CONFIG.useMockData = false`
- [ ] Update `API_CONFIG.BASE_URL` in config.js
- [ ] Update `API_CONFIG.QC_FILES_URL` in config.js
- [ ] Implement `/qc/files/:fileId` endpoint
- [ ] Implement `/qc/checkpoints/:checkpointId/parameters` endpoint
- [ ] Update checkpoint data to include `inputType`, limits, and qcFileId
- [ ] Test measurement input auto-validation
- [ ] Test QC file modal loading

---

## 📱 UI Preview

### Inspection Matrix with Measurement Inputs

```
┌────────────────────────────────────────────────────────────────┐
│  Inspection Matrix                    ✓ 5 Passed  ✗ 2 Failed  │
├────────────────┬──────────┬──────┬──────┬──────┬──────┬───────┤
│  Checkpoint    │  Spec    │  S1  │  S2  │  S3  │  S4  │  ...  │
├────────────────┼──────────┼──────┼──────┼──────┼──────┼───────┤
│  Height        │  94mm    │[94.2]│[93.8]│[____]│[____]│       │
│  Vernier       │  ±0.5mm  │  ✓   │  ✓   │  –   │  –   │       │
│  📄 QC Params  │          │      │      │      │      │       │
├────────────────┼──────────┼──────┼──────┼──────┼──────┼───────┤
│  Thickness-1   │  29mm    │[29.1]│[28.5]│[____]│[____]│       │
│  Vernier       │  ±0.3mm  │  ✓   │  ✗   │  –   │  –   │       │
│  📄 QC Params  │          │      │      │      │      │       │
└────────────────┴──────────┴──────┴──────┴──────┴──────┴───────┘
```

### QC Parameters Modal

```
┌─────────────────────────────────────────┐
│  📄 QC Parameters              [×]      │
│  Height                                 │
├─────────────────────────────────────────┤
│                                         │
│  Height Measurement Parameters          │
│  QC parameters for height measurement   │
│  Revision: 1.2  Updated: 2025-09-15     │
│                                         │
│  Parameters                             │
│  ───────────────────────────────────    │
│  Nominal Value      94mm                │
│  Upper Limit        94.5mm              │
│  Lower Limit        93.5mm              │
│  Measurement Points 3                   │
│  Instrument         Vernier Caliper     │
│  Accuracy           ±0.02mm             │
│                                         │
│  [    View Full Document    ]           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📞 Support

For questions or issues, contact the development team.

© 2025 Appasamy Associates. All rights reserved.
