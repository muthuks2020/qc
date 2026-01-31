import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Package, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { colors, shadows } from '../../constants/theme';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'inspection', icon: ClipboardCheck, label: 'Inspection' },
  { id: 'batches', icon: Package, label: 'Batches' },
  { id: 'reports', icon: BarChart3, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <div style={{
      width: '72px',
      height: '100vh',
      background: 'white',
      borderRight: `1px solid ${colors.neutral[100]}`,
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      boxShadow: shadows.sm,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <span style={{ 
          color: 'white', 
          fontWeight: 700, 
          fontSize: '18px' 
        }}>
          A
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        flex: 1,
      }}>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                background: isActive ? colors.primaryLight : 'transparent',
                color: isActive ? colors.primary : colors.neutral[400],
              }}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
