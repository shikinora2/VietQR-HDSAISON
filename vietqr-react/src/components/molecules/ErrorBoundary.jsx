import React, { Component } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../atoms';

const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px dashed ${({ theme }) => theme.colors.danger};
`;

const ErrorIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.danger};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ErrorTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 500px;
`;

const ErrorDetails = styled.pre`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.danger};
  text-align: left;
  overflow-x: auto;
  max-width: 600px;
  
  ${({ theme }) => theme.isDark && `
    background: ${theme.colors.gray[800]};
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Log to external error reporting service (if configured)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset
        });
      }

      // Default error UI
      return (
        <ErrorContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <AlertTriangle />
          </ErrorIcon>

          <ErrorTitle>
            {this.props.title || 'Oops! Something went wrong'}
          </ErrorTitle>

          <ErrorMessage>
            {this.props.message || 
              'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
          </ErrorMessage>

          {this.props.showDetails && this.state.error && (
            <ErrorDetails>
              {this.state.error.toString()}
              {this.state.errorInfo && (
                <>
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </>
              )}
            </ErrorDetails>
          )}

          <ButtonGroup>
            <Button
              variant="primary"
              onClick={this.handleReset}
              icon={<RefreshCw size={18} />}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={this.handleGoHome}
              icon={<Home size={18} />}
            >
              Go Home
            </Button>
          </ButtonGroup>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight Error Boundary for specific sections
 */
export class ErrorBoundarySection extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Section error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
          <p>This section failed to load.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export as both default and named exports
export default ErrorBoundary;
export { ErrorBoundary as GlobalErrorBoundary };
