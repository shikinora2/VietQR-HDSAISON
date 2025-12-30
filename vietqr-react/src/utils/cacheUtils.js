/**
 * Cache Utilities
 * Browser-based caching for PDFs and images with size limits and expiration
 */

const CACHE_PREFIX = 'vietqr_';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Cache item structure
 * @typedef {Object} CacheItem
 * @property {any} data - Cached data
 * @property {number} timestamp - Cache timestamp
 * @property {number} expiresAt - Expiration timestamp
 * @property {number} size - Data size in bytes
 * @property {string} type - Data type
 */

/**
 * Convert Blob to base64 for storage
 * @param {Blob} blob - Blob to convert
 * @returns {Promise<string>}
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert base64 to Blob
 * @param {string} base64 - Base64 string
 * @param {string} mimeType - MIME type
 * @returns {Blob}
 */
const base64ToBlob = (base64, mimeType) => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Calculate size of data in bytes
 * @param {any} data - Data to measure
 * @returns {number}
 */
const getDataSize = (data) => {
  if (typeof data === 'string') {
    return new Blob([data]).size;
  } else if (data instanceof Blob) {
    return data.size;
  } else {
    return new Blob([JSON.stringify(data)]).size;
  }
};

/**
 * Get total cache size
 * @returns {number} Total size in bytes
 */
export const getCacheSize = () => {
  let totalSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      const item = localStorage.getItem(key);
      totalSize += item ? item.length * 2 : 0; // Approximate size
    }
  }
  
  return totalSize;
};

/**
 * Check if cache is full
 * @returns {boolean}
 */
export const isCacheFull = () => {
  return getCacheSize() >= MAX_CACHE_SIZE;
};

/**
 * Clear expired cache items
 */
export const clearExpiredCache = () => {
  const now = Date.now();
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (item.expiresAt && item.expiresAt < now) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // Invalid JSON, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  return keysToRemove.length;
};

/**
 * Clear oldest cache items to make space
 * @param {number} bytesToFree - Bytes to free up
 */
export const clearOldestCache = (bytesToFree = MAX_CACHE_SIZE * 0.2) => {
  const items = [];
  
  // Collect all cache items with timestamps
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        items.push({
          key,
          timestamp: item.timestamp || 0,
          size: item.size || 0,
        });
      } catch (error) {
        // Invalid JSON, remove it
        localStorage.removeItem(key);
      }
    }
  }
  
  // Sort by oldest first
  items.sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove items until we've freed enough space
  let freedBytes = 0;
  for (const item of items) {
    if (freedBytes >= bytesToFree) break;
    localStorage.removeItem(item.key);
    freedBytes += item.size;
  }
  
  return freedBytes;
};

/**
 * Cache PDF blob
 * @param {string} key - Cache key
 * @param {Blob} pdfBlob - PDF blob to cache
 * @param {number} expiryMs - Expiry in milliseconds
 * @returns {Promise<boolean>}
 */
export const cachePdf = async (key, pdfBlob, expiryMs = DEFAULT_EXPIRY) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const size = pdfBlob.size;
    
    // Check if we need to make space
    if (getCacheSize() + size > MAX_CACHE_SIZE) {
      clearExpiredCache();
      
      if (getCacheSize() + size > MAX_CACHE_SIZE) {
        clearOldestCache(size);
      }
    }
    
    // Convert to base64 for storage
    const base64 = await blobToBase64(pdfBlob);
    
    const cacheItem = {
      data: base64,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiryMs,
      size,
      type: 'pdf',
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    return true;
  } catch (error) {
    console.error('Error caching PDF:', error);
    return false;
  }
};

/**
 * Get cached PDF
 * @param {string} key - Cache key
 * @returns {Promise<Blob|null>}
 */
export const getCachedPdf = async (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const itemStr = localStorage.getItem(cacheKey);
    
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    
    // Check expiry
    if (item.expiresAt && item.expiresAt < Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Convert back to Blob
    return base64ToBlob(item.data, 'application/pdf');
  } catch (error) {
    console.error('Error getting cached PDF:', error);
    return null;
  }
};

/**
 * Cache image (QR code)
 * @param {string} key - Cache key
 * @param {string} imageUrl - Image data URL or URL
 * @param {number} expiryMs - Expiry in milliseconds
 * @returns {Promise<boolean>}
 */
export const cacheImage = async (key, imageUrl, expiryMs = DEFAULT_EXPIRY) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const size = getDataSize(imageUrl);
    
    // Check if we need to make space
    if (getCacheSize() + size > MAX_CACHE_SIZE) {
      clearExpiredCache();
      
      if (getCacheSize() + size > MAX_CACHE_SIZE) {
        clearOldestCache(size);
      }
    }
    
    const cacheItem = {
      data: imageUrl,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiryMs,
      size,
      type: 'image',
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    return true;
  } catch (error) {
    console.error('Error caching image:', error);
    return false;
  }
};

/**
 * Get cached image
 * @param {string} key - Cache key
 * @returns {string|null}
 */
export const getCachedImage = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const itemStr = localStorage.getItem(cacheKey);
    
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    
    // Check expiry
    if (item.expiresAt && item.expiresAt < Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};

/**
 * Cache generic data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expiryMs - Expiry in milliseconds
 * @returns {boolean}
 */
export const cacheData = (key, data, expiryMs = DEFAULT_EXPIRY) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const serialized = JSON.stringify(data);
    const size = getDataSize(serialized);
    
    // Check if we need to make space
    if (getCacheSize() + size > MAX_CACHE_SIZE) {
      clearExpiredCache();
      
      if (getCacheSize() + size > MAX_CACHE_SIZE) {
        clearOldestCache(size);
      }
    }
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiryMs,
      size,
      type: 'data',
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any|null}
 */
export const getCachedData = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const itemStr = localStorage.getItem(cacheKey);
    
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    
    // Check expiry
    if (item.expiresAt && item.expiresAt < Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

/**
 * Remove specific cache item
 * @param {string} key - Cache key
 */
export const removeCache = (key) => {
  const cacheKey = CACHE_PREFIX + key;
  localStorage.removeItem(cacheKey);
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  return keysToRemove.length;
};

/**
 * Get cache statistics
 * @returns {Object}
 */
export const getCacheStats = () => {
  let itemCount = 0;
  let totalSize = 0;
  let expiredCount = 0;
  const types = {};
  const now = Date.now();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      itemCount++;
      
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        totalSize += item.size || 0;
        
        if (item.expiresAt && item.expiresAt < now) {
          expiredCount++;
        }
        
        if (item.type) {
          types[item.type] = (types[item.type] || 0) + 1;
        }
      } catch (error) {
        // Invalid item
      }
    }
  }
  
  return {
    itemCount,
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    maxSizeMB: (MAX_CACHE_SIZE / (1024 * 1024)).toFixed(2),
    usagePercent: ((totalSize / MAX_CACHE_SIZE) * 100).toFixed(1),
    expiredCount,
    types,
  };
};

/**
 * Check if item is cached and not expired
 * @param {string} key - Cache key
 * @returns {boolean}
 */
export const isCached = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const itemStr = localStorage.getItem(cacheKey);
    
    if (!itemStr) return false;
    
    const item = JSON.parse(itemStr);
    
    // Check expiry
    if (item.expiresAt && item.expiresAt < Date.now()) {
      localStorage.removeItem(cacheKey);
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  cachePdf,
  getCachedPdf,
  cacheImage,
  getCachedImage,
  cacheData,
  getCachedData,
  removeCache,
  clearAllCache,
  getCacheSize,
  isCacheFull,
  clearExpiredCache,
  clearOldestCache,
  getCacheStats,
  isCached,
};
