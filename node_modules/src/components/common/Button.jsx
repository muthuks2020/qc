import React from 'react';
import { colors, borderRadius, shadows } from '../../constants/theme';

const variants = {
  primary: {
    background: colors.primary,
    color: 'white',
    border: 'none',
    boxShadow: shadows.primary,
  },
  secondary: {
    background: colors.neutral[100],
    color: colors.neutral[700],
    border: 'none',
  },
  success: {
    background: colors.success,
    color: 'white',
    border: 'none',
  },
  danger: {
    background: colors.danger,
    color: 'white',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
  },
  ghost: {
    background: 'transparent',
    color: colors.neutral[600],
    border: 'none',
  },
};

const sizes = {
  sm: { padding: '8px 12px', fontSize: '13px' },
  md: { padding: '10px 20px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '15px' },
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
  ...props
}) => {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: borderRadius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...variantStyles,
        ...sizeStyles,
        ...style,
      }}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
};

export default Button;
