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
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: borderRadius.xl,
        padding,
        boxShadow: isHovered ? shadows.lg : shadows.md,
        border: `1px solid ${colors.neutral[100]}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
