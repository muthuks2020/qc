// Main Application Component
// Provides routing, authentication, and layout structure for all user personas

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, USER_ROLES } from './contexts/AuthContext';
import ProtectedRoute, { AdminRoute, MakerRoute, CheckerRoute } from './routes/ProtectedRoute';
import { MainLayout } from './components/common';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SamplingMasterPage from './pages/admin/SamplingMasterPage';
import ComponentMasterPage from './pages/admin/ComponentMasterPage';
import MakerDashboard from './pages/maker/MakerDashboard';
import CheckerDashboard from './pages/checker/CheckerDashboard';
import { colors } from './constants/theme';

/**
 * Main App Routes Component
 * Handles all routing logic based on authentication state
 */
const AppRoutes = () => {
  const { isAuthenticated, isLoading, authChecked, user, getHomeRoute, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle login success - navigate to user's home route
  const handleLoginSuccess = (user) => {
    const from = location.state?.from?.pathname;
    const homeRoute = getHomeRoute();
    navigate(from || homeRoute, { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Show loading screen while checking authentication
  if (isLoading || !authChecked) {
    return <GlobalLoadingScreen />;
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/auth/callback') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRoute()} replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        } 
      />
      
      {/* SSO Callback Route */}
      <Route 
        path="/auth/callback" 
        element={<SSOCallback />} 
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <AdminDashboard />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sampling-master"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <SamplingMasterPage />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/component-master"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <ComponentMasterPage />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <PlaceholderPage title="User Management" subtitle="Manage user accounts and permissions" />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <PlaceholderPage title="Admin Reports" subtitle="System-wide reports and analytics" />
            </MainLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <MainLayout role="admin" onLogout={handleLogout}>
              <PlaceholderPage title="System Settings" subtitle="Configure application settings" />
            </MainLayout>
          </AdminRoute>
        }
      />

      {/* Maker (QC Person) Routes */}
      <Route
        path="/maker"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <MakerDashboard />
            </MainLayout>
          </MakerRoute>
        }
      />
      <Route
        path="/maker/inspection"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <PlaceholderPage title="Inspection" subtitle="Perform quality inspections" />
            </MainLayout>
          </MakerRoute>
        }
      />
      <Route
        path="/maker/inspection/:jobId"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <PlaceholderPage title="Job Inspection" subtitle="Inspecting job..." />
            </MainLayout>
          </MakerRoute>
        }
      />
      <Route
        path="/maker/batches"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <PlaceholderPage title="Batch Management" subtitle="View and manage inspection batches" />
            </MainLayout>
          </MakerRoute>
        }
      />
      <Route
        path="/maker/history"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <PlaceholderPage title="Inspection History" subtitle="View past inspections" />
            </MainLayout>
          </MakerRoute>
        }
      />
      <Route
        path="/maker/reports"
        element={
          <MakerRoute>
            <MainLayout role="maker" onLogout={handleLogout}>
              <PlaceholderPage title="QC Reports" subtitle="Generate and view QC reports" />
            </MainLayout>
          </MakerRoute>
        }
      />

      {/* Checker (Validator) Routes */}
      <Route
        path="/checker"
        element={
          <CheckerRoute>
            <MainLayout role="checker" onLogout={handleLogout}>
              <CheckerDashboard />
            </MainLayout>
          </CheckerRoute>
        }
      />
      <Route
        path="/checker/pending"
        element={
          <CheckerRoute>
            <MainLayout role="checker" onLogout={handleLogout}>
              <PlaceholderPage title="Pending Review" subtitle="Jobs awaiting validation" />
            </MainLayout>
          </CheckerRoute>
        }
      />
      <Route
        path="/checker/validated"
        element={
          <CheckerRoute>
            <MainLayout role="checker" onLogout={handleLogout}>
              <PlaceholderPage title="Validated Jobs" subtitle="Approved inspection jobs" />
            </MainLayout>
          </CheckerRoute>
        }
      />
      <Route
        path="/checker/rejected"
        element={
          <CheckerRoute>
            <MainLayout role="checker" onLogout={handleLogout}>
              <PlaceholderPage title="Rejected Jobs" subtitle="Jobs requiring re-inspection" />
            </MainLayout>
          </CheckerRoute>
        }
      />
      <Route
        path="/checker/reports"
        element={
          <CheckerRoute>
            <MainLayout role="checker" onLogout={handleLogout}>
              <PlaceholderPage title="Validation Reports" subtitle="QC validation analytics" />
            </MainLayout>
          </CheckerRoute>
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRoute()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

/**
 * Global Loading Screen
 */
const GlobalLoadingScreen = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.loadingContent}>
      <div style={styles.logoWrapper}>
        <img 
          src="https://cdn.prod.website-files.com/637e4dc883878debd9d96de4/63df53786bf1b137a5731bb2_AA%20Logo(1).png"
          alt="Appasamy Associates"
          style={styles.loadingLogo}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <div style={styles.spinnerLarge} />
      <p style={styles.loadingText}>Loading QC Application...</p>
    </div>
  </div>
);

/**
 * SSO Callback Handler
 */
const SSOCallback = () => {
  const { handleSSOCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      console.error('SSO Error:', error);
      navigate('/login', { state: { error: 'SSO authentication failed' } });
      return;
    }

    if (code) {
      handleSSOCallback(code).then((result) => {
        if (result.success) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { state: { error: result.error } });
        }
      });
    } else {
      navigate('/login');
    }
  }, [location, navigate, handleSSOCallback]);

  return <GlobalLoadingScreen />;
};

/**
 * Placeholder Page for routes under development
 */
const PlaceholderPage = ({ title, subtitle }) => (
  <div style={styles.placeholderContainer}>
    <div style={styles.placeholderContent}>
      <div style={styles.placeholderIcon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.neutral[300]} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      <h1 style={styles.placeholderTitle}>{title}</h1>
      <p style={styles.placeholderSubtitle}>{subtitle}</p>
      <div style={styles.comingSoonBadge}>
        Coming Soon
      </div>
    </div>
  </div>
);

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  const { isAuthenticated, getHomeRoute } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.notFoundContainer}>
      <div style={styles.notFoundContent}>
        <h1 style={styles.notFoundCode}>404</h1>
        <h2 style={styles.notFoundTitle}>Page Not Found</h2>
        <p style={styles.notFoundText}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? getHomeRoute() : '/login')}
          style={styles.notFoundButton}
        >
          Go to {isAuthenticated ? 'Dashboard' : 'Login'}
        </button>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Styles
const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  logoWrapper: {
    padding: '16px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  loadingLogo: {
    height: '48px',
    width: 'auto',
  },
  spinnerLarge: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
  },
  
  placeholderContainer: {
    padding: '64px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  placeholderContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  placeholderIcon: {
    marginBottom: '24px',
    opacity: 0.5,
  },
  placeholderTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.neutral[800],
    marginBottom: '8px',
  },
  placeholderSubtitle: {
    fontSize: '14px',
    color: colors.neutral[500],
    marginBottom: '24px',
  },
  comingSoonBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: colors.brand.primary,
    background: colors.primaryLight,
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  notFoundContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.neutral[50],
    padding: '24px',
  },
  notFoundContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  notFoundCode: {
    fontSize: '96px',
    fontWeight: 700,
    color: colors.neutral[200],
    lineHeight: 1,
    marginBottom: '8px',
  },
  notFoundTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.neutral[800],
    marginBottom: '12px',
  },
  notFoundText: {
    fontSize: '14px',
    color: colors.neutral[500],
    marginBottom: '24px',
    lineHeight: 1.6,
  },
  notFoundButton: {
    display: 'inline-block',
    padding: '12px 32px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'white',
    background: colors.brand.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// Add global CSS for animations
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    min-height: 100vh;
  }
`;
document.head.appendChild(globalStyles);

export default App;
