import React, { useState } from 'react';
import { Sidebar } from './components/common';
import { DashboardPage, InspectionPage } from './pages';
import { colors } from './constants/theme';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleNavigate = (viewId) => {
    setActiveView(viewId);
    if (viewId === 'dashboard') {
      setSelectedJobId(null);
    }
  };

  const handleNavigateToInspection = (jobId) => {
    setSelectedJobId(jobId);
    setActiveView('inspection');
  };

  const handleBackToDashboard = () => {
    setSelectedJobId(null);
    setActiveView('dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: colors.neutral[50],
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Sidebar */}
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main style={{
        marginLeft: '72px',
        flex: 1,
        minHeight: '100vh',
      }}>
        {activeView === 'dashboard' && (
          <DashboardPage onNavigateToInspection={handleNavigateToInspection} />
        )}
        {activeView === 'inspection' && (
          <InspectionPage jobId={selectedJobId} onBack={handleBackToDashboard} />
        )}
        {activeView === 'batches' && (
          <PlaceholderPage title="Batches" />
        )}
        {activeView === 'reports' && (
          <PlaceholderPage title="Reports" />
        )}
        {activeView === 'settings' && (
          <PlaceholderPage title="Settings" />
        )}
      </main>
    </div>
  );
}

// Placeholder for other pages
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '32px 40px' }}>
    <h1 style={{ color: colors.neutral[800] }}>{title}</h1>
    <p style={{ color: colors.neutral[500] }}>This page is coming soon.</p>
  </div>
);

export default App;
