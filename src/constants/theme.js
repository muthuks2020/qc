// Appasamy QC App - Theme Constants
// Brand colors inspired by https://www.appasamy.com/

export const colors = {
  // Appasamy Brand Colors
  brand: {
    primary: '#003366',      // Deep Navy Blue
    secondary: '#004C8C',    // Medium Blue
    accent: '#0066CC',       // Bright Blue
    highlight: '#00A0E3',    // Light Blue
    dark: '#001F3F',         // Dark Navy
  },
  
  // Primary colors (main brand)
  primary: '#003366',
  primaryDark: '#001F3F',
  primaryLight: '#E6EEF5',
  primaryHover: '#004C8C',
  
  // Secondary accent
  accent: '#00A0E3',
  accentDark: '#0080B3',
  accentLight: '#E6F7FC',
  
  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  dangerDark: '#DC2626',
  
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Neutral palette
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Role-specific colors
  roles: {
    admin: {
      primary: '#7C3AED',
      light: '#EDE9FE',
      dark: '#5B21B6',
    },
    maker: {
      primary: '#003366',
      light: '#E6EEF5',
      dark: '#001F3F',
    },
    checker: {
      primary: '#059669',
      light: '#D1FAE5',
      dark: '#047857',
    },
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
  lg: '0 4px 12px rgba(0,0,0,0.1)',
  xl: '0 8px 24px rgba(0,0,0,0.12)',
  primary: '0 4px 14px rgba(0, 51, 102, 0.25)',
  accent: '0 4px 14px rgba(0, 160, 227, 0.25)',
  card: '0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.1)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  full: '9999px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
  spring: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export default {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  transitions,
  zIndex,
};
