/**
 * Performance Optimization Hooks
 * Custom hooks for performance improvements
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Debounce hook - Delays function execution
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebounce = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Debounced value hook
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook - Limits function execution rate
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottle = (callback, limit = 300) => {
  const inThrottle = useRef(false);

  const throttledCallback = useCallback(
    (...args) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );

  return throttledCallback;
};

/**
 * Lazy load component with loading state
 * @param {Function} importFunc - Dynamic import function
 * @returns {Object} Component and loading state
 */
export const useLazyLoad = (importFunc) => {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [importFunc]);

  return { component, loading, error };
};

/**
 * Memoized callback with dependencies
 * @param {Function} callback - Callback function
 * @param {Array} deps - Dependencies array
 * @returns {Function} Memoized callback
 */
export const useMemoizedCallback = (callback, deps = []) => {
  return useCallback(callback, deps);
};

/**
 * Memoized value with expensive computation
 * @param {Function} computeValue - Function to compute value
 * @param {Array} deps - Dependencies array
 * @returns {any} Memoized value
 */
export const useMemoizedValue = (computeValue, deps = []) => {
  return useMemo(computeValue, deps);
};

/**
 * Previous value hook - Get previous value of state
 * @param {any} value - Current value
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * RAF (RequestAnimationFrame) throttle hook
 * @param {Function} callback - Function to throttle
 * @returns {Function} RAF throttled function
 */
export const useRAFThrottle = (callback) => {
  const rafRef = useRef(null);
  const lastArgs = useRef([]);

  const throttledCallback = useCallback(
    (...args) => {
      lastArgs.current = args;
      
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          callback(...lastArgs.current);
          rafRef.current = null;
        });
      }
    },
    [callback]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Idle callback hook - Execute callback when browser is idle
 * @param {Function} callback - Function to execute
 * @param {Object} options - Options for requestIdleCallback
 */
export const useIdleCallback = (callback, options = {}) => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, options);
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }
  }, [callback, options]);
};

/**
 * Async data hook with loading state
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} deps - Dependencies array
 * @returns {Object} Data, loading, and error state
 */
export const useAsync = (asyncFunction, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    asyncFunction()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
};

/**
 * Mount status hook - Check if component is still mounted
 * @returns {Object} isMounted ref
 */
export const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

/**
 * Update effect hook - Skip first render
 * @param {Function} effect - Effect function
 * @param {Array} deps - Dependencies array
 */
export const useUpdateEffect = (effect, deps) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps);
};

/**
 * Deep compare effect - Use deep comparison for deps
 * @param {Function} effect - Effect function
 * @param {Array} deps - Dependencies array
 */
export const useDeepCompareEffect = (effect, deps) => {
  const ref = useRef(deps);
  const signalRef = useRef(0);

  if (!deepEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  useEffect(effect, [signalRef.current]);
};

// Helper function for deep comparison
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

/**
 * Measure render performance
 * @param {string} componentName - Name of component
 * @param {Object} props - Component props
 */
export const useMeasureRender = (componentName, props = {}) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered ${renderCount.current} times`, props);
    }
  });
};

export default {
  useDebounce,
  useDebouncedValue,
  useThrottle,
  useLazyLoad,
  useMemoizedCallback,
  useMemoizedValue,
  usePrevious,
  useRAFThrottle,
  useIdleCallback,
  useAsync,
  useIsMounted,
  useUpdateEffect,
  useDeepCompareEffect,
  useMeasureRender,
};