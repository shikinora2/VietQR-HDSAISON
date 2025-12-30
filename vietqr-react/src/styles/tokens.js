// Design Tokens - VietQR HDSAISON
// Based on DESIGN_SYSTEM.md

export const colors = {
  // Primary Colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  
  // Success Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
  },
  
  // Accent Colors
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  
  // Danger Colors
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  // Numeric tokens for backward compatibility
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
};

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  
  // Dark mode shadows
  dark: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const transition = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

export const zIndex = {
  base: 0,
  sidebar: 100,
  header: 200,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Theme definitions
export const lightTheme = {
  colors: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    success: colors.success[500],
    accent: colors.accent[500],
    danger: colors.danger[500],
    
    text: colors.gray[900],
    textSecondary: colors.gray[600],
    textMuted: colors.gray[500],
    
    background: colors.gray[50],
    surface: '#FFFFFF',
    surfaceHover: colors.gray[50],
    
    border: colors.gray[200],
    borderHover: colors.gray[300],
    
    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },
  shadows,
};

export const darkTheme = {
  colors: {
    primary: colors.primary[500],
    primaryHover: colors.primary[400],
    success: colors.success[500],
    accent: colors.accent[500],
    danger: colors.danger[500],
    
    text: colors.gray[50],
    textSecondary: colors.gray[300],
    textMuted: colors.gray[400],
    
    background: colors.gray[900],
    surface: colors.gray[800],
    surfaceHover: colors.gray[700],
    
    border: colors.gray[700],
    borderHover: colors.gray[600],
    
    // Glassmorphism
    glass: 'rgba(31, 41, 59, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },
  shadows: shadows.dark,
};

// Export default theme object
export const theme = {
  colors,
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  lightTheme,
  darkTheme,
};

export default theme;
