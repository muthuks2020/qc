# Appasamy QC Application

Quality Control Management System for Appasamy Associates B-SCAN Products

## 🚀 Features

### Role-Based Access Control
- **Admin** - System configuration, sampling masters, component masters, user management
- **Maker (QC Person)** - Perform quality inspections, enter QC data
- **Checker (Validator)** - Review and validate QC entries, approve/reject inspections

### Key Capabilities
- Professional login page with Appasamy branding
- Office 365 SSO integration ready (easily configurable)
- Real-time inspection tracking
- Maker-Checker-Approver workflow
- Responsive design for all devices
- Complete audit trail

## 📁 Project Structure

```
appasamy-qc-app/
├── src/
│   ├── components/
│   │   └── common/           # Reusable components
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Header.jsx
│   │       ├── MainLayout.jsx
│   │       ├── Sidebar.jsx
│   │       └── index.js
│   ├── constants/
│   │   └── theme.js          # Brand colors & design tokens
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SamplingMasterPage.jsx
│   │   │   └── ComponentMasterPage.jsx
│   │   ├── maker/
│   │   │   └── MakerDashboard.jsx
│   │   └── checker/
│   │       └── CheckerDashboard.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Maker (QC Person) | qcmaker | maker123 |
| Checker (Validator) | qcchecker | checker123 |

## 🎨 Brand Colors

Based on [Appasamy Website](https://www.appasamy.com/):

- **Deep Navy Blue**: #003366 (Primary)
- **Medium Blue**: #004C8C
- **Bright Blue**: #0066CC
- **Light Blue**: #00A0E3 (Accent)

### Role-Specific Colors
- **Admin**: Purple (#7C3AED)
- **Maker**: Navy Blue (#003366)
- **Checker**: Green (#059669)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Office 365 SSO Configuration

The application is prepared for Office 365 SSO integration. To enable:

### 1. Azure AD Setup
1. Go to Azure Portal → Azure Active Directory
2. App Registrations → New Registration
3. Configure:
   - Name: "Appasamy QC Application"
   - Redirect URI: `https://your-domain.com/auth/callback`
4. Note down the **Client ID** and **Tenant ID**

### 2. Update Configuration

In `src/contexts/AuthContext.jsx`, update the SSO config:

```javascript
sso: {
  enabled: true,  // Change to true
  provider: 'microsoft',
  tenantId: 'YOUR_AZURE_TENANT_ID',
  clientId: 'YOUR_AZURE_CLIENT_ID',
  redirectUri: 'https://your-domain.com/auth/callback',
  scopes: ['openid', 'profile', 'email', 'User.Read'],
}
```

### 3. Backend Integration
Create a backend endpoint to:
- Exchange authorization code for tokens
- Validate tokens and extract user info
- Map Azure AD user to app roles (Admin/Maker/Checker)
- Return session token

## 📱 Routes

### Public Routes
- `/login` - Login page

### Admin Routes (`/admin/*`)
- `/admin` - Admin Dashboard
- `/admin/sampling-master` - Sampling Plan Configuration
- `/admin/component-master` - Component Specifications
- `/admin/users` - User Management
- `/admin/reports` - System Reports
- `/admin/settings` - System Settings

### Maker Routes (`/maker/*`)
- `/maker` - QC Workstation Dashboard
- `/maker/inspection` - Inspection Entry
- `/maker/inspection/:jobId` - Job Inspection
- `/maker/batches` - Batch Management
- `/maker/history` - Inspection History
- `/maker/reports` - QC Reports

### Checker Routes (`/checker/*`)
- `/checker` - Validation Dashboard
- `/checker/pending` - Pending Reviews
- `/checker/validated` - Validated Jobs
- `/checker/rejected` - Rejected Jobs
- `/checker/reports` - Validation Reports

## 🧩 Components

### Common Components
- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **Card** - Content container with hover effects
- **Badge** - Status and priority indicators
- **Header** - Page header with title, search, and actions
- **Sidebar** - Role-aware navigation sidebar
- **MainLayout** - Authenticated page wrapper

### Usage Example

```jsx
import { Button, Card, Badge, Header } from './components/common';

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="outline" icon={Plus}>Add New</Button>

// Badge types
<Badge type="status" value="pending" />
<Badge type="priority" value="high" />

// Cards
<Card hover onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

## 🔒 Protected Routes

Routes are protected based on user roles:

```jsx
import { AdminRoute, MakerRoute, CheckerRoute } from './routes';

<AdminRoute>
  <AdminDashboard />
</AdminRoute>

<MakerRoute>
  <MakerDashboard />
</MakerRoute>

<CheckerRoute>
  <CheckerDashboard />
</CheckerRoute>
```

## 📦 Dependencies

- **React 18** - UI Framework
- **React Router v6** - Routing
- **Lucide React** - Icons
- **Vite** - Build tool

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables for production

## 📞 Support

For questions or issues, contact:
- Shellkode Development Team
- Appasamy Associates IT Department

---

**Empowering Vision Since 1978**

© 2026 Appasamy Associates. All rights reserved.
