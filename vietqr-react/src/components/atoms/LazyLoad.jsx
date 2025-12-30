/**
 * Lazy Load Wrapper Component
 * Generic lazy loading for any component
 */

import React, { Suspense, lazy as reactLazy } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ============================================
// Loading Components
// ============================================

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.$minHeight || '200px'};
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border.main};
  border-top-color: ${props => props.theme.colors.primary.main};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSize.sm};
`;

export const LoadingSpinner = ({ minHeight, text }) => (
  <LoadingContainer $minHeight={minHeight}>
    <div style={{ textAlign: 'center' }}>
      <Spinner
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <LoadingText>{text}</LoadingText>}
    </div>
  </LoadingContainer>
);

// ============================================
// Skeleton Loaders
// ============================================

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    ${props => props.theme.colors.background.elevated} 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: ${props => props.theme.borderRadius.md};
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export const SkeletonBox = styled(SkeletonBase)`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '100px'};
`;

export const SkeletonText = styled(SkeletonBase)`
  width: ${props => props.$width || '100%'};
  height: 16px;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const SkeletonCard = () => (
  <div style={{ padding: '24px' }}>
    <SkeletonBox $height="200px" style={{ marginBottom: '16px' }} />
    <SkeletonText $width="80%" />
    <SkeletonText $width="60%" />
    <SkeletonText $width="70%" />
  </div>
);

// ============================================
// Error Boundary
// ============================================

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ErrorTitle = styled.h3`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RetryButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary.dark};
    transform: translateY(-1px);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.props.fallbackMessage || 'Failed to load component. Please try again.'}
          </ErrorMessage>
          <RetryButton onClick={this.handleReset}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// ============================================
// Lazy Load Wrapper
// ============================================

/**
 * Create lazy loaded component with loading state
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options
 * @returns {Component} Lazy component
 */
export const lazy = (importFunc, options = {}) => {
  const {
    fallback = <LoadingSpinner />,
    errorFallback,
    onError,
  } = options;

  const LazyComponent = reactLazy(importFunc);

  return (props) => (
    <ErrorBoundary fallbackMessage={errorFallback} onReset={onError}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// ============================================
// Preload Helper
// ============================================

/**
 * Preload component for faster subsequent renders
 * @param {Function} importFunc - Dynamic import function
 * @returns {Promise} Import promise
 */
export const preloadComponent = (importFunc) => {
  return importFunc();
};

// ============================================
// Lazy Load with Retry
// ============================================

/**
 * Lazy load with automatic retry on failure
 * @param {Function} importFunc - Dynamic import function
 * @param {number} retries - Number of retries
 * @returns {Promise} Import promise
 */
export const lazyWithRetry = (importFunc, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attemptImport = (attemptsLeft) => {
      importFunc()
        .then(resolve)
        .catch((error) => {
          if (attemptsLeft === 0) {
            reject(error);
          } else {
            console.warn(`Import failed, retrying... (${attemptsLeft} attempts left)`);
            setTimeout(() => attemptImport(attemptsLeft - 1), 1000);
          }
        });
    };

    attemptImport(retries);
  });
};

// ============================================
// Default Export
// ============================================

export default lazy;