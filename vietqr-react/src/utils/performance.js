/**
 * Performance Utilities
 * Helper functions for optimization
 */

/**
 * Create a memoized selector function
 * @param {Function} selector - Selector function
 * @returns {Function} Memoized selector
 */
export const createMemoizedSelector = (selector) => {
  let lastArgs = null;
  let lastResult = null;

  return (...args) => {
    if (
      !lastArgs ||
      args.length !== lastArgs.length ||
      args.some((arg, index) => arg !== lastArgs[index])
    ) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    return lastResult;
  };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * RequestAnimationFrame throttle
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export const rafThrottle = (func) => {
  let rafId = null;
  
  return function(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
};

/**
 * Lazy load image
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source
 * @param {Function} onLoad - Load callback
 */
export const lazyLoadImage = (img, src, onLoad) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.onload = onLoad;
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
};

/**
 * Preload images
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Promise<Array>} Promise resolving when all images loaded
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

/**
 * Chunk array for batching
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array<Array>} Chunked array
 */
export const chunk = (array, size = 10) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Process array in batches with delay
 * @param {Array} array - Array to process
 * @param {Function} processor - Processing function
 * @param {number} batchSize - Batch size
 * @param {number} delay - Delay between batches in ms
 * @returns {Promise} Promise resolving when complete
 */
export const batchProcess = async (array, processor, batchSize = 10, delay = 0) => {
  const chunks = chunk(array, batchSize);
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(processor));
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Memoize function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Create a simple cache with expiration
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Object} Cache object
 */
export const createCache = (ttl = 60000) => {
  const cache = new Map();
  
  return {
    get(key) {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
      }
      
      return item.value;
    },
    
    set(key, value) {
      cache.set(key, {
        value,
        expiry: Date.now() + ttl,
      });
    },
    
    has(key) {
      return this.get(key) !== null;
    },
    
    delete(key) {
      cache.delete(key);
    },
    
    clear() {
      cache.clear();
    },
    
    size() {
      return cache.size;
    },
  };
};

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for logging
 * @returns {Function} Wrapped function
 */
export const measurePerformance = (fn, label = 'Function') => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`[Performance] ${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
};

/**
 * Request idle callback with fallback
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 * @returns {number} Request ID
 */
export const requestIdleCallback = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers without requestIdleCallback
  return setTimeout(callback, 1);
};

/**
 * Cancel idle callback with fallback
 * @param {number} id - Request ID
 */
export const cancelIdleCallback = (id) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Detect if user prefers reduced motion
 * @returns {boolean} True if reduced motion preferred
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Get network connection info
 * @returns {Object} Connection info
 */
export const getConnectionInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { effectiveType: '4g', saveData: false };
  }
  
  const connection = navigator.connection;
  return {
    effectiveType: connection.effectiveType,
    saveData: connection.saveData,
    downlink: connection.downlink,
    rtt: connection.rtt,
  };
};

/**
 * Check if connection is slow
 * @returns {boolean} True if slow connection
 */
export const isSlowConnection = () => {
  const { effectiveType, saveData } = getConnectionInfo();
  return effectiveType === 'slow-2g' || effectiveType === '2g' || saveData;
};

/**
 * Optimize bundle with code splitting helper
 * @param {Function} loader - Dynamic import function
 * @param {Object} options - Options
 * @returns {Function} Wrapped loader
 */
export const optimizeBundle = (loader, options = {}) => {
  const { 
    timeout = 10000,
    fallback = null,
    onError = console.error,
  } = options;
  
  return () => {
    const loadPromise = loader();
    
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Loading timeout')), timeout);
    });
    
    return Promise.race([loadPromise, timeoutPromise])
      .catch((error) => {
        onError(error);
        return fallback;
      });
  };
};

/**
 * Virtual scroll calculator
 * @param {Object} params - Scroll parameters
 * @returns {Object} Visible items info
 */
export const calculateVirtualScroll = ({
  scrollTop,
  containerHeight,
  itemHeight,
  itemCount,
  overscan = 3,
}) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return {
    startIndex,
    endIndex,
    visibleCount: endIndex - startIndex + 1,
    offsetTop: startIndex * itemHeight,
  };
};

export default {
  createMemoizedSelector,
  debounce,
  throttle,
  rafThrottle,
  lazyLoadImage,
  preloadImages,
  chunk,
  batchProcess,
  memoize,
  createCache,
  measurePerformance,
  requestIdleCallback,
  cancelIdleCallback,
  prefersReducedMotion,
  getConnectionInfo,
  isSlowConnection,
  optimizeBundle,
  calculateVirtualScroll,
};