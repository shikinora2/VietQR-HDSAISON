/**
 * Responsive Hooks
 * Custom hooks for responsive behavior and breakpoint detection
 */

import { useState, useEffect, useCallback } from 'react';

// Breakpoint values (must match tokens.js)
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

/**
 * Hook to detect current breakpoint
 * @returns {Object} Current breakpoint info
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < BREAKPOINTS.tablet) return 'mobile';
    if (width < BREAKPOINTS.desktop) return 'tablet';
    if (width < BREAKPOINTS.wide) return 'desktop';
    return 'wide';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint;
      
      if (width < BREAKPOINTS.tablet) {
        newBreakpoint = 'mobile';
      } else if (width < BREAKPOINTS.desktop) {
        newBreakpoint = 'tablet';
      } else if (width < BREAKPOINTS.wide) {
        newBreakpoint = 'desktop';
      } else {
        newBreakpoint = 'wide';
      }

      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
    isDesktopOrWider: breakpoint === 'desktop' || breakpoint === 'wide',
  };
};

/**
 * Hook to get window dimensions
 * @returns {Object} Window width and height
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Hook for media query matching
 * @param {string} query - Media query string
 * @returns {boolean} Whether the query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

/**
 * Hook for touch device detection
 * @returns {boolean} Whether device supports touch
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    window.addEventListener('touchstart', checkTouch, { once: true });
    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
};

/**
 * Hook for orientation detection
 * @returns {string} Current orientation ('portrait' | 'landscape')
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
};

/**
 * Hook for responsive value selection
 * @param {Object} values - Values for each breakpoint
 * @returns {any} Value for current breakpoint
 */
export const useResponsiveValue = (values) => {
  const { breakpoint } = useBreakpoint();
  
  return values[breakpoint] || values.default || values.desktop;
};

/**
 * Hook for detecting scroll direction
 * @returns {Object} Scroll direction info
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return {
    scrollDirection,
    scrollY,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
    isAtTop: scrollY < 50,
  };
};

/**
 * Hook for viewport visibility detection
 * @param {Object} ref - React ref to element
 * @param {Object} options - IntersectionObserver options
 * @returns {boolean} Whether element is visible
 */
export const useIntersectionObserver = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isVisible;
};

/**
 * Hook for device pixel ratio detection
 * @returns {number} Device pixel ratio
 */
export const usePixelRatio = () => {
  const [pixelRatio, setPixelRatio] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  });

  useEffect(() => {
    const handleChange = () => {
      setPixelRatio(window.devicePixelRatio || 1);
    };

    const mediaQuery = window.matchMedia(`(resolution: ${pixelRatio}dppx)`);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [pixelRatio]);

  return pixelRatio;
};

export default useBreakpoint;