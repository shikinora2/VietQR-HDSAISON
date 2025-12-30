/**
 * Format number to Vietnamese currency
 * @param {number|string} value - The value to format
 * @param {boolean} showSymbol - Whether to show ₫ symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, showSymbol = true) => {
  if (value === null || value === undefined || value === '') return showSymbol ? '0 ₫' : '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
  if (isNaN(numValue)) return showSymbol ? '0 ₫' : '0';
  
  const formatted = new Intl.NumberFormat('vi-VN').format(numValue);
  return showSymbol ? `${formatted} ₫` : formatted;
};

/**
 * Format phone number to Vietnamese format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // Format: 0123 456 789
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11) {
    // Format: 0123 456 7890
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return cleaned;
};

/**
 * Format date to Vietnamese format
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'short':
      return `${day}/${month}/${year}`;
    case 'long':
      return `${day} tháng ${month}, ${year}`;
    case 'datetime':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'time':
      return `${hours}:${minutes}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Convert string to title case (capitalize first letter of each word)
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format contract number with leading zeros
 * @param {string|number} contractNumber - Contract number
 * @param {number} length - Desired length (default 8)
 * @returns {string} Formatted contract number
 */
export const formatContractNumber = (contractNumber, length = 8) => {
  if (!contractNumber) return '';
  
  const cleaned = String(contractNumber).replace(/\D/g, '');
  return cleaned.padStart(length, '0');
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Parse currency string to number
 * @param {string} value - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  const cleaned = String(value).replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format number with thousand separators
 * @param {number|string} value - Value to format
 * @returns {string} Formatted number
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('vi-VN').format(numValue);
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};
