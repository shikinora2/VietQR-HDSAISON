/**
 * Remove Vietnamese diacritics (accent marks)
 * @param {string} str - String to process
 * @returns {string} String without Vietnamese accents
 */
export const stripVietnamese = (str) => {
  if (!str) return '';
  
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  
  return str;
};

/**
 * Extract only digits from string
 * @param {string} str - String to process
 * @returns {string} String containing only digits
 */
export const digitsOnly = (str) => {
  if (!str) return '';
  return String(str).replace(/\D/g, '');
};

/**
 * Generate slug from string
 * @param {string} str - String to convert to slug
 * @returns {string} Slug string
 */
export const slugify = (str) => {
  if (!str) return '';
  
  let slug = stripVietnamese(str);
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');
  slug = slug.trim();
  
  return slug;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase to Title Case
 * @param {string} str - camelCase string
 * @returns {string} Title Case string
 */
export const camelToTitle = (str) => {
  if (!str) return '';
  
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Mask sensitive information (e.g., phone, ID)
 * @param {string} str - String to mask
 * @param {number} visibleStart - Number of visible characters at start
 * @param {number} visibleEnd - Number of visible characters at end
 * @returns {string} Masked string
 */
export const maskString = (str, visibleStart = 3, visibleEnd = 3) => {
  if (!str) return '';
  
  const length = str.length;
  
  if (length <= visibleStart + visibleEnd) {
    return str;
  }
  
  const start = str.substring(0, visibleStart);
  const end = str.substring(length - visibleEnd);
  const maskLength = length - visibleStart - visibleEnd;
  const mask = '*'.repeat(maskLength);
  
  return `${start}${mask}${end}`;
};

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
export const randomString = (length = 8, charset = 'alphanumeric') => {
  let chars = '';
  
  switch (charset) {
    case 'alphanumeric':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      break;
    case 'alpha':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      break;
    case 'numeric':
      chars = '0123456789';
      break;
    case 'uppercase':
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      break;
    default:
      chars = charset;
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Clean whitespace (trim and collapse multiple spaces)
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
export const cleanWhitespace = (str) => {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Extract numbers from string
 * @param {string} str - String to process
 * @returns {number[]} Array of numbers found in string
 */
export const extractNumbers = (str) => {
  if (!str) return [];
  
  const matches = String(str).match(/\d+/g);
  return matches ? matches.map(Number) : [];
};

/**
 * Check if string contains only Vietnamese characters
 * @param {string} str - String to check
 * @returns {boolean} True if contains only Vietnamese characters
 */
export const isVietnamese = (str) => {
  if (!str) return false;
  
  const vietnameseRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
  return vietnameseRegex.test(str);
};

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = (str) => {
  if (!str) return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string to parse
 * @returns {object} Parsed query parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Build query string from object
 * @param {object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};
