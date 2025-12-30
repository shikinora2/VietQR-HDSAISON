import React from 'react';

/**
 * Error Logging and Monitoring System
 * Centralized error tracking and reporting
 */

/**
 * Error severity levels
 */
export const ErrorLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

/**
 * Error categories
 */
export const ErrorCategory = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTH: 'authentication',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown',
};

/**
 * Error Logger Class
 */
class ErrorLogger {
  constructor(config = {}) {
    this.config = {
      enableConsole: true,
      enableStorage: true,
      maxStorageSize: 100,
      enableRemoteLogging: false,
      remoteEndpoint: null,
      ...config,
    };

    this.errors = [];
    this.listeners = [];
    this.init();
  }

  init() {
    // Load errors from storage
    if (this.config.enableStorage) {
      this.loadFromStorage();
    }

    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError({
          message: event.message,
          stack: event.error?.stack,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          level: ErrorLevel.ERROR,
          category: ErrorCategory.CLIENT,
        });
      });

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          level: ErrorLevel.ERROR,
          category: ErrorCategory.CLIENT,
        });
      });
    }
  }

  /**
   * Log an error
   */
  logError(error) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      level: error.level || ErrorLevel.ERROR,
      category: error.category || ErrorCategory.UNKNOWN,
      context: error.context || {},
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      ...error,
    };

    // Add to errors array
    this.errors.unshift(errorEntry);

    // Limit array size
    if (this.errors.length > this.config.maxStorageSize) {
      this.errors = this.errors.slice(0, this.config.maxStorageSize);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(errorEntry);
    }

    // Storage
    if (this.config.enableStorage) {
      this.saveToStorage();
    }

    // Remote logging
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      this.sendToRemote(errorEntry);
    }

    // Notify listeners
    this.notifyListeners(errorEntry);

    return errorEntry;
  }

  /**
   * Log to console
   */
  logToConsole(error) {
    const style = this.getConsoleStyle(error.level);
    const message = `[${error.level.toUpperCase()}] ${error.category}: ${error.message}`;

    switch (error.level) {
      case ErrorLevel.DEBUG:
        console.debug(message, error);
        break;
      case ErrorLevel.INFO:
        console.info(message, error);
        break;
      case ErrorLevel.WARNING:
        console.warn(message, error);
        break;
      case ErrorLevel.ERROR:
      case ErrorLevel.CRITICAL:
        console.error(message, error);
        break;
      default:
        console.log(message, error);
    }
  }

  /**
   * Get console style based on level
   */
  getConsoleStyle(level) {
    const styles = {
      [ErrorLevel.DEBUG]: 'color: #6c757d',
      [ErrorLevel.INFO]: 'color: #17a2b8',
      [ErrorLevel.WARNING]: 'color: #ffc107',
      [ErrorLevel.ERROR]: 'color: #dc3545',
      [ErrorLevel.CRITICAL]: 'color: #fff; background: #dc3545; font-weight: bold',
    };
    return styles[level] || '';
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('error_logs', JSON.stringify(this.errors));
    } catch (error) {
      console.warn('Failed to save errors to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('error_logs');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load errors from storage:', error);
    }
  }

  /**
   * Send error to remote endpoint
   */
  async sendToRemote(error) {
    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      });
    } catch (err) {
      console.warn('Failed to send error to remote:', err);
    }
  }

  /**
   * Subscribe to errors
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify listeners
   */
  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.warn('Error in listener:', err);
      }
    });
  }

  /**
   * Get all errors
   */
  getErrors(filter = {}) {
    let filtered = [...this.errors];

    if (filter.level) {
      filtered = filtered.filter(e => e.level === filter.level);
    }

    if (filter.category) {
      filtered = filtered.filter(e => e.category === filter.category);
    }

    if (filter.startDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= filter.startDate);
    }

    if (filter.endDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) <= filter.endDate);
    }

    return filtered;
  }

  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.errors.length,
      byLevel: {},
      byCategory: {},
      recentErrors: this.errors.slice(0, 5),
    };

    this.errors.forEach(error => {
      // Count by level
      stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
      
      // Count by category
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
    if (this.config.enableStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Export errors
   */
  exportErrors(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.errors, null, 2);
    }

    if (format === 'csv') {
      const headers = ['Timestamp', 'Level', 'Category', 'Message'];
      const rows = this.errors.map(e => [
        e.timestamp,
        e.level,
        e.category,
        e.message,
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return this.errors;
  }
}

// Global logger instance
export const errorLogger = new ErrorLogger();

/**
 * Convenience functions
 */
export const logError = (message, context = {}) => {
  return errorLogger.logError({
    message,
    level: ErrorLevel.ERROR,
    category: ErrorCategory.CLIENT,
    context,
  });
};

export const logWarning = (message, context = {}) => {
  return errorLogger.logError({
    message,
    level: ErrorLevel.WARNING,
    context,
  });
};

export const logInfo = (message, context = {}) => {
  return errorLogger.logError({
    message,
    level: ErrorLevel.INFO,
    context,
  });
};

export const logDebug = (message, context = {}) => {
  return errorLogger.logError({
    message,
    level: ErrorLevel.DEBUG,
    context,
  });
};

export const logNetworkError = (error, config = {}) => {
  return errorLogger.logError({
    message: error.message || 'Network error',
    level: ErrorLevel.ERROR,
    category: ErrorCategory.NETWORK,
    context: {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      ...config,
    },
    stack: error.stack,
  });
};

export const logValidationError = (field, message, context = {}) => {
  return errorLogger.logError({
    message: `Validation error: ${field} - ${message}`,
    level: ErrorLevel.WARNING,
    category: ErrorCategory.VALIDATION,
    context: { field, ...context },
  });
};

/**
 * React hook for error logging
 */
export const useErrorLogger = () => {
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    setErrors(errorLogger.getErrors());

    const unsubscribe = errorLogger.subscribe(() => {
      setErrors(errorLogger.getErrors());
    });

    return unsubscribe;
  }, []);

  return {
    errors,
    logError,
    logWarning,
    logInfo,
    logDebug,
    getStats: () => errorLogger.getStats(),
    clearErrors: () => errorLogger.clearErrors(),
    exportErrors: (format) => errorLogger.exportErrors(format),
  };
};

/**
 * Higher-order component for error logging
 */
export const withErrorLogging = (Component) => {
  return function WithErrorLogging(props) {
    const errorHandlers = {
      onError: (error, context) => {
        logError(error.message || error, context);
      },
      onWarning: (message, context) => {
        logWarning(message, context);
      },
    };

    return <Component {...props} {...errorHandlers} />;
  };
};

export default {
  ErrorLogger,
  errorLogger,
  ErrorLevel,
  ErrorCategory,
  logError,
  logWarning,
  logInfo,
  logDebug,
  logNetworkError,
  logValidationError,
  useErrorLogger,
  withErrorLogging,
};
