import React from 'react';
import { colors, borderRadius, shadows } from '../../constants/theme';

export const Card = ({
  children,
  padding = '24px',
  hover = false,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: borderRadius.xl,
        padding,
        boxShadow: shadows.md,
        border: `1px solid ${colors.neutral[100]}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        ...(hover && {
          ':hover': {
            boxShadow: shadows.lg,
            transform: 'translateY(-2px)',
          },
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
