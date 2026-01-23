import React from 'react';
import { BarChart3, ClipboardCheck, Package, FileText, Settings } from 'lucide-react';
import { colors } from '../../constants/theme';

const navItems = [
  { icon: BarChart3, id: 'dashboard', label: 'Dashboard' },
  { icon: ClipboardCheck, id: 'inspection', label: 'Inspection' },
  { icon: Package, id: 'batches', label: 'Batches' },
  { icon: FileText, id: 'reports', label: 'Reports' },
  { icon: Settings, id: 'settings', label: 'Settings' },
];

export const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <div style={{
      width: '72px',
      background: colors.neutral[900],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '24px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        width: '44px',
        height: '44px',
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(0, 102, 204, 0.4)',
      }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>AA</span>
      </div>

      {/* Nav Items */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              border: 'none',
              background: isActive ? colors.primary : 'transparent',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Icon
              size={22}
              color={isActive ? 'white' : colors.neutral[400]}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
