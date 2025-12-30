/**
 * Responsive Utilities
 * Helper functions for responsive design
 */

import { css } from 'styled-components';

// Breakpoint values
export const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

/**
 * Media query helper for styled-components
 * @param {string} breakpoint - Breakpoint name
 * @returns {Function} Media query function
 */
export const media = {
  mobile: (...args) => css`
    @media (max-width: ${breakpoints.tablet - 1}px) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (min-width: ${breakpoints.desktop}px) {
      ${css(...args)}
    }
  `,
  wide: (...args) => css`
    @media (min-width: ${breakpoints.wide}px) {
      ${css(...args)}
    }
  `,
  // Utility helpers
  up: (breakpoint) => (...args) => css`
    @media (min-width: ${breakpoints[breakpoint]}px) {
      ${css(...args)}
    }
  `,
  down: (breakpoint) => (...args) => css`
    @media (max-width: ${breakpoints[breakpoint] - 1}px) {
      ${css(...args)}
    }
  `,
  between: (min, max) => (...args) => css`
    @media (min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px) {
      ${css(...args)}
    }
  `,
};

/**
 * Get responsive value based on breakpoint
 * @param {Object} values - Values for each breakpoint
 * @param {string} currentBreakpoint - Current breakpoint
 * @returns {any} Value for current breakpoint
 */
export const getResponsiveValue = (values, currentBreakpoint) => {
  if (typeof values !== 'object') return values;
  
  const breakpointOrder = ['wide', 'desktop', 'tablet', 'mobile'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Find the first available value at or below current breakpoint
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) return values[bp];
  }
  
  return values.default || values[breakpointOrder[breakpointOrder.length - 1]];
};

/**
 * Generate responsive spacing
 * @param {Object} spacing - Spacing values for each breakpoint
 * @returns {string} CSS with media queries
 */
export const responsiveSpacing = (spacing) => {
  if (typeof spacing === 'string' || typeof spacing === 'number') {
    return css`${spacing}`;
  }

  return css`
    ${spacing.mobile && media.mobile`
      padding: ${spacing.mobile};
    `}
    ${spacing.tablet && media.tablet`
      padding: ${spacing.tablet};
    `}
    ${spacing.desktop && media.desktop`
      padding: ${spacing.desktop};
    `}
    ${spacing.wide && media.wide`
      padding: ${spacing.wide};
    `}
  `;
};

/**
 * Generate responsive grid
 * @param {Object} columns - Column count for each breakpoint
 * @returns {string} CSS with media queries
 */
export const responsiveGrid = (columns) => {
  return css`
    display: grid;
    gap: ${props => props.theme.spacing.md};
    
    ${columns.mobile && media.mobile`
      grid-template-columns: repeat(${columns.mobile}, 1fr);
    `}
    ${columns.tablet && media.tablet`
      grid-template-columns: repeat(${columns.tablet}, 1fr);
    `}
    ${columns.desktop && media.desktop`
      grid-template-columns: repeat(${columns.desktop}, 1fr);
    `}
    ${columns.wide && media.wide`
      grid-template-columns: repeat(${columns.wide}, 1fr);
    `}
  `;
};

/**
 * Generate responsive font size
 * @param {Object} sizes - Font sizes for each breakpoint
 * @returns {string} CSS with media queries
 */
export const responsiveFontSize = (sizes) => {
  if (typeof sizes === 'string' || typeof sizes === 'number') {
    return css`font-size: ${sizes};`;
  }

  return css`
    ${sizes.mobile && media.mobile`
      font-size: ${sizes.mobile};
    `}
    ${sizes.tablet && media.tablet`
      font-size: ${sizes.tablet};
    `}
    ${sizes.desktop && media.desktop`
      font-size: ${sizes.desktop};
    `}
    ${sizes.wide && media.wide`
      font-size: ${sizes.wide};
    `}
  `;
};

/**
 * Hide element on specific breakpoints
 * @param {Array} breakpoints - Breakpoints to hide on
 * @returns {string} CSS with media queries
 */
export const hideOn = (breakpointsToHide) => {
  return css`
    ${breakpointsToHide.includes('mobile') && media.mobile`
      display: none;
    `}
    ${breakpointsToHide.includes('tablet') && media.tablet`
      display: none;
    `}
    ${breakpointsToHide.includes('desktop') && media.desktop`
      display: none;
    `}
    ${breakpointsToHide.includes('wide') && media.wide`
      display: none;
    `}
  `;
};

/**
 * Show element only on specific breakpoints
 * @param {Array} breakpoints - Breakpoints to show on
 * @returns {string} CSS with media queries
 */
export const showOn = (breakpointsToShow) => {
  const allBreakpoints = ['mobile', 'tablet', 'desktop', 'wide'];
  const breakpointsToHide = allBreakpoints.filter(bp => !breakpointsToShow.includes(bp));
  return hideOn(breakpointsToHide);
};

/**
 * Container with responsive padding
 * @returns {string} CSS for container
 */
export const responsiveContainer = () => css`
  width: 100%;
  margin: 0 auto;
  
  ${media.mobile`
    padding: 0 ${props => props.theme.spacing.md};
  `}
  ${media.tablet`
    padding: 0 ${props => props.theme.spacing.lg};
    max-width: ${breakpoints.tablet}px;
  `}
  ${media.desktop`
    padding: 0 ${props => props.theme.spacing.xl};
    max-width: ${breakpoints.desktop}px;
  `}
  ${media.wide`
    padding: 0 ${props => props.theme.spacing['2xl']};
    max-width: ${breakpoints.wide}px;
  `}
`;

/**
 * Touch-friendly target size
 * @param {number} size - Minimum touch target size (default: 44px)
 * @returns {string} CSS for touch target
 */
export const touchTarget = (size = 44) => css`
  min-width: ${size}px;
  min-height: ${size}px;
  padding: ${(size - 20) / 2}px;
  
  @media (hover: none) and (pointer: coarse) {
    /* Increase size on touch devices */
    min-width: ${size + 4}px;
    min-height: ${size + 4}px;
  }
`;

/**
 * Prevent text selection (useful for buttons on mobile)
 * @returns {string} CSS for preventing selection
 */
export const preventSelection = () => css`
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
`;

/**
 * Safe area insets for mobile devices
 * @returns {string} CSS for safe area padding
 */
export const safeAreaInsets = () => css`
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
`;

/**
 * Horizontal scroll container (for mobile swipe)
 * @returns {string} CSS for horizontal scroll
 */
export const horizontalScroll = () => css`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  > * {
    scroll-snap-align: start;
    flex-shrink: 0;
  }
`;

/**
 * Aspect ratio box
 * @param {number} ratio - Aspect ratio (width/height)
 * @returns {string} CSS for aspect ratio
 */
export const aspectRatio = (ratio = 16/9) => css`
  position: relative;
  
  &::before {
    content: '';
    display: block;
    padding-top: ${(1 / ratio) * 100}%;
  }
  
  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

/**
 * Truncate text with ellipsis
 * @param {number} lines - Number of lines before truncation
 * @returns {string} CSS for text truncation
 */
export const truncateText = (lines = 1) => {
  if (lines === 1) {
    return css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;
  }
  
  return css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
};

export default {
  media,
  breakpoints,
  getResponsiveValue,
  responsiveSpacing,
  responsiveGrid,
  responsiveFontSize,
  hideOn,
  showOn,
  responsiveContainer,
  touchTarget,
  preventSelection,
  safeAreaInsets,
  horizontalScroll,
  aspectRatio,
  truncateText,
};