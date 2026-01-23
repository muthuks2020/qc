# Appasamy QC - Quality Control Application

A modern, modular React application for digitizing quality control inspection processes.

## 📁 Project Structure

```
appasamy-qc/
├── public/
│   └── uploads/
│       └── appasamy-logo.png      # Company logo
├── src/
│   ├── api/                        # API Layer
│   │   ├── config.js               # API configuration & endpoints
│   │   ├── mockData.js             # Mock data for development
│   │   ├── qcService.js            # QC API service functions
│   │   └── index.js                # API exports
│   │
│   ├── components/                 # Reusable UI Components
│   │   ├── common/                 # Shared components
│   │   │   ├── Button.jsx          # Button component
│   │   │   ├── Card.jsx            # Card container
│   │   │   ├── Badge.jsx           # Status/priority badges
│   │   │   ├── Header.jsx          # Page header with logo
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── index.js
│   │   │
│   │   ├── dashboard/              # Dashboard-specific components
│   │   │   ├── StatCard.jsx        # Statistics card
│   │   │   ├── JobCard.jsx         # QC job card
│   │   │   └── index.js
│   │   │
│   │   └── inspection/             # Inspection-specific components
│   │       ├── InspectionMatrix.jsx # Tap-to-toggle matrix
│   │       ├── BatchInfo.jsx       # Batch information panel
│   │       └── index.js
│   │
│   ├── pages/                      # Page Components
│   │   ├── DashboardPage.jsx       # Main dashboard
│   │   ├── InspectionPage.jsx      # Inspection form
│   │   └── index.js
│   │
│   ├── constants/                  # Constants & Theme
│   │   └── theme.js                # Colors, shadows, etc.
│   │
│   ├── hooks/                      # Custom React Hooks (future)
│   ├── context/                    # React Context (future)
│   ├── utils/                      # Utility functions (future)
│   │
│   ├── App.jsx                     # Main App component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
│
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| react | UI Framework |
| react-dom | React DOM |
| lucide-react | Icon library |
| vite | Build tool |

## 🔌 API Integration

### Replacing Mock Data with Real Odoo API

The app uses mock data by default. To connect to your Odoo backend:

1. **Update API Configuration** (`src/api/config.js`):
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-server.com/api',
  ODOO_URL: 'https://your-odoo-instance.com',
};
```

2. **Implement Real API Calls** (`src/api/qcService.js`):
```javascript
// Replace mock implementation
export const fetchPendingJobs = async () => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/qc/pending-jobs`);
  return response.json();
};
```

### API Endpoints Expected

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/qc/pending-jobs` | GET | List pending QC jobs |
| `/qc/jobs/:id` | GET | Get job details |
| `/qc/jobs/:id/submit` | POST | Submit inspection |
| `/odoo/grn` | GET | Fetch GRN from Odoo |
| `/odoo/update-qc-result` | POST | Update Odoo with results |

## 🎨 Component Architecture

### Adding New Components

1. Create component in appropriate folder:
```jsx
// src/components/common/NewComponent.jsx
export const NewComponent = ({ prop1, prop2 }) => {
  return <div>...</div>;
};
```

2. Export from index:
```javascript
// src/components/common/index.js
export { NewComponent } from './NewComponent';
```

3. Use in pages:
```javascript
import { NewComponent } from '../components/common';
```

### Adding New Pages

1. Create page in `src/pages/`:
```jsx
// src/pages/NewPage.jsx
export const NewPage = () => {
  return <div>New Page Content</div>;
};
```

2. Export from index and add to App.jsx routing.

## 🔧 Customization

### Colors (src/constants/theme.js)
```javascript
export const colors = {
  primary: '#0066CC',      // Change primary color
  success: '#10B981',      // Change success color
  // ... etc
};
```

### Adding New Mock Data
Edit `src/api/mockData.js` to add test data.

## 📱 Features

- **Dashboard View**: KPIs, pending jobs queue, activity feed
- **Inspection Matrix**: Tap-to-toggle OK/NG for samples
- **Batch Information**: Auto-populated from Odoo GRN
- **Responsive Design**: Works on desktop and iPad
- **Modular Architecture**: Easy to extend and maintain

## 🛠️ Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

© 2025 Appasamy Associates. All rights reserved.
