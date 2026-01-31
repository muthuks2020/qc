import React from 'react';
import { colors, shadows } from '../../constants/theme';

export const Header = ({ title, subtitle, children }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 700,
          color: colors.neutral[800],
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: colors.neutral[500],
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Header;
