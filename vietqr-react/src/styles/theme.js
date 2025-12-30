/**
 * New VietQR Theme System - Clean Architecture
 * Built from scratch to avoid all previous layout issues
 */

// ============================================
// Design Tokens
// ============================================

const colors = {
  // Primary - HD SAISON Brand
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main brand color
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral Grays
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
    950: '#030712',
  },

  // Success
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },

  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  // Error
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Info
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
};

const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  // Semantic spacing aliases for component compatibility
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

const borderRadius = {
  none: '0',
  sm: '0.25rem',     // 4px
  base: '0.5rem',    // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  full: '9999px',
};

const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
};

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================
// Light Theme
// ============================================

export const lightTheme = {
  name: 'light',

  colors: {
    // Brand
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    primaryLight: colors.primary[50],

    // Status
    success: colors.success[500],
    successLight: colors.success[50],
    warning: colors.warning[500],
    warningLight: colors.warning[50],
    error: colors.error[500],
    errorLight: colors.error[50],
    info: colors.info[500],
    infoLight: colors.info[50],

    // Text
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      tertiary: colors.gray[500],
      disabled: colors.gray[400],
      inverse: '#FFFFFF',
    },

    // Background
    bg: {
      primary: '#FFFFFF',
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
      inverse: colors.gray[900],
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Background alias for component compatibility
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      secondary: colors.gray[50],
    },

    // Border
    border: {
      default: colors.gray[200],
      hover: colors.gray[300],
      focus: colors.primary[500],
      error: colors.error[500],
      light: colors.gray[200],
    },

    // Interactive
    interactive: {
      default: colors.primary[500],
      hover: colors.primary[600],
      active: colors.primary[700],
      disabled: colors.gray[300],
    },

    // Surface (cards, panels)
    surface: {
      default: '#FFFFFF',
      hover: colors.gray[50],
      active: colors.gray[100],
    },

    // Raw color palette
    ...colors,
  },

  spacing,
  typography,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,

  // Top-level typography shortcuts for component compatibility
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================
// Dark Theme
// ============================================

export const darkTheme = {
  ...lightTheme,
  name: 'dark',

  colors: {
    // Brand (brighter for dark mode)
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryActive: colors.primary[200],
    primaryLight: colors.primary[900],

    // Status
    success: colors.success[500],
    successLight: colors.success[900],
    warning: colors.warning[500],
    warningLight: colors.warning[900],
    error: colors.error[500],
    errorLight: colors.error[900],
    info: colors.info[500],
    infoLight: colors.info[900],

    // Text
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
      disabled: colors.gray[600],
      inverse: colors.gray[900],
    },

    // Background
    bg: {
      primary: colors.gray[950],
      secondary: colors.gray[900],
      tertiary: colors.gray[800],
      inverse: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },

    // Background alias for component compatibility
    background: {
      paper: colors.gray[900],
      default: colors.gray[950],
      secondary: colors.gray[800],
    },

    // Border
    border: {
      default: colors.gray[700],
      hover: colors.gray[600],
      focus: colors.primary[400],
      error: colors.error[500],
      light: colors.gray[700],
    },

    // Interactive
    interactive: {
      default: colors.primary[400],
      hover: colors.primary[300],
      active: colors.primary[200],
      disabled: colors.gray[700],
    },

    // Surface (cards, panels)
    surface: {
      default: colors.gray[900],
      hover: colors.gray[800],
      active: colors.gray[700],
    },

    // Raw color palette
    ...colors,
  },

  // Override shadows for dark mode
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },
};

// Default export
export default lightTheme;
