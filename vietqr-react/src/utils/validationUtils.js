/**
 * Validate Vietnamese phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Vietnamese phone numbers: 10 or 11 digits, starting with 0
  return /^0\d{9,10}$/.test(cleaned);
};

/**
 * Validate contract number
 * @param {string} contractNumber - Contract number to validate
 * @returns {boolean} True if valid
 */
export const isValidContractNumber = (contractNumber) => {
  if (!contractNumber) return false;
  
  const cleaned = String(contractNumber).replace(/\D/g, '');
  
  // Contract number: 6-12 digits
  return /^\d{6,12}$/.test(cleaned);
};

/**
 * Validate amount (must be positive number)
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum amount
 * @param {number} max - Maximum amount
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateAmount = (amount, min = 0, max = Infinity) => {
  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, error: 'Vui lòng nhập số tiền' };
  }
  
  const numAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^\d.-]/g, '')) 
    : amount;
  
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Số tiền không hợp lệ' };
  }
  
  if (numAmount < min) {
    return { valid: false, error: `Số tiền phải lớn hơn ${min.toLocaleString('vi-VN')} ₫` };
  }
  
  if (numAmount > max) {
    return { valid: false, error: `Số tiền không được vượt quá ${max.toLocaleString('vi-VN')} ₫` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateRequired = (value, fieldName = 'Trường này') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} là bắt buộc` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} là bắt buộc` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate Vietnamese ID card number (CMND/CCCD)
 * @param {string} idNumber - ID number to validate
 * @returns {boolean} True if valid
 */
export const isValidIDNumber = (idNumber) => {
  if (!idNumber) return false;
  
  const cleaned = idNumber.replace(/\D/g, '');
  
  // CMND: 9 or 12 digits, CCCD: 12 digits
  return /^\d{9}$/.test(cleaned) || /^\d{12}$/.test(cleaned);
};

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Vui lòng chọn khoảng thời gian' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Ngày không hợp lệ' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Ngày bắt đầu phải trước ngày kết thúc' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate interest rate
 * @param {number|string} rate - Interest rate to validate
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateInterestRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') {
    return { valid: false, error: 'Vui lòng nhập lãi suất' };
  }
  
  const numRate = typeof rate === 'string' 
    ? parseFloat(rate.replace(/[^\d.-]/g, '')) 
    : rate;
  
  if (isNaN(numRate)) {
    return { valid: false, error: 'Lãi suất không hợp lệ' };
  }
  
  if (numRate < 0 || numRate > 100) {
    return { valid: false, error: 'Lãi suất phải từ 0% đến 100%' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate loan term (in months)
 * @param {number|string} term - Loan term to validate
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateLoanTerm = (term) => {
  if (term === null || term === undefined || term === '') {
    return { valid: false, error: 'Vui lòng nhập kỳ hạn' };
  }
  
  const numTerm = typeof term === 'string' 
    ? parseInt(term.replace(/\D/g, '')) 
    : term;
  
  if (isNaN(numTerm)) {
    return { valid: false, error: 'Kỳ hạn không hợp lệ' };
  }
  
  if (numTerm < 1 || numTerm > 360) {
    return { valid: false, error: 'Kỳ hạn phải từ 1 đến 360 tháng' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate down payment percentage
 * @param {number|string} percent - Down payment percentage
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validateDownPaymentPercent = (percent) => {
  if (percent === null || percent === undefined || percent === '') {
    return { valid: false, error: 'Vui lòng nhập tỷ lệ trả trước' };
  }
  
  const numPercent = typeof percent === 'string' 
    ? parseFloat(percent.replace(/[^\d.-]/g, '')) 
    : percent;
  
  if (isNaN(numPercent)) {
    return { valid: false, error: 'Tỷ lệ không hợp lệ' };
  }
  
  if (numPercent < 0 || numPercent > 100) {
    return { valid: false, error: 'Tỷ lệ phải từ 0% đến 100%' };
  }
  
  return { valid: true, error: null };
};
