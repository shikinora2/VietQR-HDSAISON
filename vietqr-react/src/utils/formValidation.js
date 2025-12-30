import React from 'react';

/**
 * Advanced Form Validation Utilities
 * Comprehensive validation rules and helpers
 */

/**
 * Validation Rules
 */

export const validators = {
  // Required field
  required: (value, message = 'This field is required') => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return null;
  },

  // Minimum length
  minLength: (min, message) => (value) => {
    if (!value) return null;
    const length = typeof value === 'string' ? value.length : value.toString().length;
    if (length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  // Maximum length
  maxLength: (max, message) => (value) => {
    if (!value) return null;
    const length = typeof value === 'string' ? value.length : value.toString().length;
    if (length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return null;
  },

  // Email validation
  email: (value, message = 'Invalid email address') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  // Vietnamese phone number
  phone: (value, message = 'Invalid phone number') => {
    if (!value) return null;
    const cleaned = value.replace(/\D/g, '');
    // Vietnamese: 10-11 digits, starts with 0
    if (!/^0\d{9,10}$/.test(cleaned)) {
      return message;
    }
    return null;
  },

  // Contract number (6-12 digits)
  contractNumber: (value, message = 'Invalid contract number (6-12 digits)') => {
    if (!value) return null;
    const cleaned = String(value).replace(/\D/g, '');
    if (!/^\d{6,12}$/.test(cleaned)) {
      return message;
    }
    return null;
  },

  // URL validation
  url: (value, message = 'Invalid URL') => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  // Number validation
  number: (value, message = 'Must be a valid number') => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  // Minimum value
  min: (minValue, message) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < minValue) {
      return message || `Must be at least ${minValue}`;
    }
    return null;
  },

  // Maximum value
  max: (maxValue, message) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num > maxValue) {
      return message || `Must be no more than ${maxValue}`;
    }
    return null;
  },

  // Range validation
  range: (min, max, message) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      return message || `Must be between ${min} and ${max}`;
    }
    return null;
  },

  // Pattern matching
  pattern: (regex, message = 'Invalid format') => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  },

  // Custom validator
  custom: (validatorFn, message = 'Validation failed') => (value) => {
    try {
      const isValid = validatorFn(value);
      return isValid ? null : message;
    } catch (error) {
      console.error('Custom validator error:', error);
      return message;
    }
  },

  // Match another field (for password confirmation)
  matches: (otherValue, message = 'Values do not match') => (value) => {
    if (value !== otherValue) {
      return message;
    }
    return null;
  },

  // Date validation
  date: (value, message = 'Invalid date') => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return message;
    }
    return null;
  },

  // Past date only
  pastDate: (value, message = 'Date must be in the past') => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime()) || date >= new Date()) {
      return message;
    }
    return null;
  },

  // Future date only
  futureDate: (value, message = 'Date must be in the future') => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime()) || date <= new Date()) {
      return message;
    }
    return null;
  },

  // Array length validation
  arrayLength: (min, max, message) => (value) => {
    if (!Array.isArray(value)) return null;
    const length = value.length;
    if (length < min || length > max) {
      return message || `Must have between ${min} and ${max} items`;
    }
    return null;
  },

  // File size validation (in MB)
  fileSize: (maxSizeMB, message) => (file) => {
    if (!file) return null;
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return message || `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  },

  // File type validation
  fileType: (allowedTypes, message) => (file) => {
    if (!file) return null;
    const fileType = file.type || '';
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(category);
      }
      return fileType === type;
    });
    if (!isAllowed) {
      return message || `Allowed types: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
};

/**
 * Compose multiple validators
 */
export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

/**
 * Validate single field
 */
export const validateField = (value, rules) => {
  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  for (const rule of rules) {
    const error = typeof rule === 'function' ? rule(value) : rule;
    if (error) return error;
  }

  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (values, validationSchema) => {
  const errors = {};

  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = values[field];
    const error = validateField(value, rules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Form validation hook
 */
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Validate single field
  const validateSingleField = React.useCallback((name, value) => {
    const rules = validationSchema[name];
    if (!rules) return null;

    return validateField(value, rules);
  }, [validationSchema]);

  // Handle field change
  const handleChange = React.useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateSingleField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateSingleField]);

  // Handle field blur
  const handleBlur = React.useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    const error = validateSingleField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [values, validateSingleField]);

  // Validate all fields
  const validateAll = React.useCallback(() => {
    const result = validateForm(values, validationSchema);
    setErrors(result.errors);
    return result.isValid;
  }, [values, validationSchema]);

  // Handle submit
  const handleSubmit = React.useCallback(async (onSubmit) => {
    setIsSubmitting(true);

    // Touch all fields
    const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate
    const isValid = validateAll();

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
    return isValid;
  }, [values, validationSchema, validateAll]);

  // Reset form
  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field error manually
  const setFieldError = React.useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Set multiple errors
  const setFieldErrors = React.useCallback((newErrors) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset,
    setFieldError,
    setFieldErrors,
    setValues,
  };
};

/**
 * Get field props for easier integration
 */
export const getFieldProps = (formState, name) => {
  return {
    name,
    value: formState.values[name] || '',
    onChange: (e) => {
      const value = e.target ? e.target.value : e;
      formState.handleChange(name, value);
    },
    onBlur: () => formState.handleBlur(name),
    error: formState.touched[name] ? formState.errors[name] : undefined,
  };
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Login form
  login: {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(6)],
  },

  // Registration form
  register: {
    email: [validators.required, validators.email],
    password: [
      validators.required,
      validators.minLength(8),
      validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    ],
    confirmPassword: [validators.required],
  },

  // Contract form
  contract: {
    contractNumber: [validators.required, validators.contractNumber],
    customerName: [validators.required, validators.minLength(2)],
    amount: [validators.required, validators.number, validators.min(0)],
    phoneNumber: [validators.phone],
  },

  // Profile form
  profile: {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    phone: [validators.phone],
    bio: [validators.maxLength(500)],
  },
};

export default {
  validators,
  composeValidators,
  validateField,
  validateForm,
  useFormValidation,
  getFieldProps,
  commonSchemas,
};
