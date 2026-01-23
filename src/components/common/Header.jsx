import React from 'react';
import { colors } from '../../constants/theme';

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
          fontSize: '28px',
          fontWeight: 700,
          color: colors.neutral[800],
          marginBottom: '4px',
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: colors.neutral[500], fontSize: '14px', margin: '4px 0 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {children}
        <img
          src="/uploads/appasamy-logo.png"
          alt="Appasamy Associates"
          className="app-logo"
        />
      </div>
    </div>
  );
};

export default Header;
