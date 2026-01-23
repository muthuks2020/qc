import React from 'react';
import { colors } from '../../constants/theme';

const statusStyles = {
  pending: {
    background: colors.warningLight,
    color: colors.warning,
  },
  in_progress: {
    background: colors.primaryLight,
    color: colors.primary,
  },
  completed: {
    background: colors.successLight,
    color: colors.success,
  },
  rejected: {
    background: colors.dangerLight,
    color: colors.danger,
  },
};

const priorityStyles = {
  high: {
    background: colors.dangerLight,
    color: colors.danger,
  },
  medium: {
    background: colors.warningLight,
    color: colors.warning,
  },
  low: {
    background: colors.neutral[100],
    color: colors.neutral[600],
  },
};

export const Badge = ({
  children,
  type = 'status', // 'status' | 'priority'
  value,
  size = 'md',
  style = {},
}) => {
  const styles = type === 'priority' ? priorityStyles : statusStyles;
  const badgeStyle = styles[value] || styles.pending;

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 12px', fontSize: '12px' },
    lg: { padding: '6px 14px', fontSize: '13px' },
  };

  const formatLabel = (val) => {
    return val?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || children;
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '20px',
        fontWeight: 500,
        ...badgeStyle,
        ...sizeStyles[size],
        ...style,
      }}
    >
      {formatLabel(value)}
    </span>
  );
};

export default Badge;
