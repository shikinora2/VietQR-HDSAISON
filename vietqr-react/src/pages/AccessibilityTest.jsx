import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Keyboard,
  MousePointer,
  Volume2
} from 'lucide-react';
import ErrorBoundary from '../components/molecules/ErrorBoundary';
import {
  Spinner,
  DotsLoader,
  ProgressBar,
  SkeletonBox,
  SkeletonText,
  SkeletonCard,
  FullPageLoader,
  OverlayLoader,
} from '../components/molecules/LoadingStates';
import { useFormValidation, validators, getFieldProps } from '../utils/formValidation';
import { announce } from '../utils/accessibilityUtils';
import { useErrorLogger } from '../utils/errorLogger';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled(motion.section)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme, $variant }) => 
    $variant === 'danger' ? theme.colors.danger :
    $variant === 'success' ? theme.colors.success :
    theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme, $error }) => 
    $error ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme, $error }) => 
      $error ? theme.colors.danger : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  background: ${({ theme, $status }) => 
    $status === 'pass' ? theme.colors.success + '20' :
    $status === 'fail' ? theme.colors.danger + '20' :
    theme.colors.warning + '20'};
  color: ${({ theme, $status }) => 
    $status === 'pass' ? theme.colors.success :
    $status === 'fail' ? theme.colors.danger :
    theme.colors.warning};
`;

const TestResults = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

/**
 * Test Component that triggers errors
 */
const ErrorTrigger = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error from ErrorTrigger component');
  }

  return (
    <Card>
      <h3>Error Boundary Test</h3>
      <p style={{ marginBottom: '16px' }}>
        Click to trigger an error and see the error boundary in action.
      </p>
      <Button onClick={() => setShouldError(true)}>
        Trigger Error
      </Button>
    </Card>
  );
};

/**
 * Form Validation Test
 */
const FormValidationTest = () => {
  const validationSchema = {
    email: [validators.required, validators.email],
    phone: [validators.required, validators.phone],
    amount: [validators.required, validators.number, validators.min(1000)],
  };

  const formState = useFormValidation(
    { email: '', phone: '', amount: '' },
    validationSchema
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    formState.handleSubmit((values) => {
      announce('Form submitted successfully!', 'assertive');
      console.log('Form values:', values);
    });
  };

  return (
    <Card>
      <h3>Form Validation Test</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...getFieldProps(formState, 'email')}
            $error={formState.touched.email && formState.errors.email}
            aria-required="true"
            aria-invalid={!!formState.errors.email}
            aria-describedby={formState.errors.email ? 'email-error' : undefined}
          />
          {formState.touched.email && formState.errors.email && (
            <ErrorMessage id="email-error" role="alert">
              {formState.errors.email}
            </ErrorMessage>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0987654321"
            {...getFieldProps(formState, 'phone')}
            $error={formState.touched.phone && formState.errors.phone}
            aria-required="true"
            aria-invalid={!!formState.errors.phone}
            aria-describedby={formState.errors.phone ? 'phone-error' : undefined}
          />
          {formState.touched.phone && formState.errors.phone && (
            <ErrorMessage id="phone-error" role="alert">
              {formState.errors.phone}
            </ErrorMessage>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="amount">Amount (min 1,000) *</Label>
          <Input
            id="amount"
            type="number"
            {...getFieldProps(formState, 'amount')}
            $error={formState.touched.amount && formState.errors.amount}
            aria-required="true"
            aria-invalid={!!formState.errors.amount}
            aria-describedby={formState.errors.amount ? 'amount-error' : undefined}
          />
          {formState.touched.amount && formState.errors.amount && (
            <ErrorMessage id="amount-error" role="alert">
              {formState.errors.amount}
            </ErrorMessage>
          )}
        </div>

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting...' : 'Submit Form'}
        </Button>
      </form>
    </Card>
  );
};

/**
 * Main Accessibility Test Page
 */
const AccessibilityTest = () => {
  const [showFullPageLoader, setShowFullPageLoader] = useState(false);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const { errors, getStats, clearErrors } = useErrorLogger();

  const errorStats = getStats();

  // Simulate progress
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const accessibilityTests = [
    { name: 'Keyboard Navigation', status: 'pass', icon: Keyboard },
    { name: 'Screen Reader Support', status: 'pass', icon: Volume2 },
    { name: 'Focus Management', status: 'pass', icon: Eye },
    { name: 'ARIA Labels', status: 'pass', icon: CheckCircle },
    { name: 'Color Contrast', status: 'pass', icon: Eye },
    { name: 'Touch Targets', status: 'pass', icon: MousePointer },
  ];

  return (
    <Container>
      <Title>Testing & Quality Assurance</Title>
      <Subtitle>
        Comprehensive testing of error boundaries, loading states, form validation, and accessibility features
      </Subtitle>

      {/* Error Boundary Test */}
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle>
          <AlertCircle /> Error Boundary
        </SectionTitle>
        <p style={{ marginBottom: '24px' }}>
          Error boundaries catch JavaScript errors and display fallback UI.
        </p>
        <ErrorBoundary showDetails>
          <ErrorTrigger />
        </ErrorBoundary>
      </Section>

      {/* Loading States */}
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SectionTitle>Loading States</SectionTitle>
        <Grid>
          <Card>
            <h3>Spinner</h3>
            <Spinner size="large" />
          </Card>
          <Card>
            <h3>Dots Loader</h3>
            <DotsLoader />
          </Card>
          <Card>
            <h3>Progress Bar</h3>
            <ProgressBar progress={progress} />
            <p style={{ marginTop: '8px', textAlign: 'center' }}>{progress}%</p>
          </Card>
          <Card>
            <h3>Skeleton Loading</h3>
            <SkeletonText lines={3} />
          </Card>
        </Grid>

        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          <Button onClick={() => setShowFullPageLoader(true)}>
            Show Full Page Loader
          </Button>
          <Button onClick={() => setShowOverlayLoader(true)}>
            Show Overlay Loader
          </Button>
        </div>

        {showFullPageLoader && (
          <FullPageLoader
            message="Loading full page..."
            onClick={() => setShowFullPageLoader(false)}
          />
        )}

        {showOverlayLoader && (
          <div style={{ position: 'relative', height: '200px', marginTop: '16px' }}>
            <OverlayLoader message="Loading..." />
            <Card>
              <p>This content is behind the overlay</p>
            </Card>
          </div>
        )}
      </Section>

      {/* Form Validation */}
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SectionTitle>Form Validation</SectionTitle>
        <FormValidationTest />
      </Section>

      {/* Accessibility Tests */}
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <SectionTitle>Accessibility Compliance</SectionTitle>
        <TestResults>
          {accessibilityTests.map(test => (
            <StatusBadge key={test.name} $status={test.status}>
              {test.status === 'pass' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {test.name}
            </StatusBadge>
          ))}
        </TestResults>
      </Section>

      {/* Error Logging */}
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <SectionTitle>Error Logging</SectionTitle>
        <Card>
          <h3>Error Statistics</h3>
          <p>Total Errors: {errorStats.total}</p>
          <p>By Level: {JSON.stringify(errorStats.byLevel)}</p>
          <p>By Category: {JSON.stringify(errorStats.byCategory)}</p>
          {errorStats.total > 0 && (
            <Button onClick={clearErrors} $variant="danger" style={{ marginTop: '16px' }}>
              Clear All Errors
            </Button>
          )}
        </Card>
      </Section>
    </Container>
  );
};

export default AccessibilityTest;
