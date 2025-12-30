import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Spinner Loading
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '16px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '16px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.gray[200]};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingSpinner = ({ size = 'medium', ...props }) => (
  <SpinnerContainer {...props}>
    <Spinner $size={size} />
  </SpinnerContainer>
);

// Dots Loading
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const DotsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Dot = styled.div`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '6px';
      case 'large': return '14px';
      default: return '10px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '6px';
      case 'large': return '14px';
      default: return '10px';
    }
  }};
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const LoadingDots = ({ size = 'medium', ...props }) => (
  <DotsContainer {...props}>
    <Dot $size={size} $delay={-0.32} />
    <Dot $size={size} $delay={-0.16} />
    <Dot $size={size} $delay={0} />
  </DotsContainer>
);

// Progress Bar
const ProgressContainer = styled.div`
  width: 100%;
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '4px';
      case 'large': return '12px';
      default: return '8px';
    }
  }};
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary[500]},
    ${({ theme }) => theme.colors.primary[600]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`;

export const LoadingProgress = ({
  progress = 0,
  size = 'medium',
  showLabel = true,
  ...props
}) => (
  <div {...props}>
    <ProgressContainer $size={size}>
      <ProgressBar
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </ProgressContainer>
    {showLabel && <ProgressLabel>{Math.round(progress)}%</ProgressLabel>}
  </div>
);

// Skeleton Loading
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[200]} 0%,
    ${({ theme }) => theme.colors.gray[300]} 50%,
    ${({ theme }) => theme.colors.gray[200]} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: ${({ theme, $rounded }) =>
    $rounded ? theme.borderRadius.full : theme.borderRadius.md};

  ${({ $variant }) => {
    switch ($variant) {
      case 'text':
        return `
          height: 16px;
          width: 100%;
          margin-bottom: 8px;
        `;
      case 'title':
        return `
          height: 24px;
          width: 60%;
          margin-bottom: 12px;
        `;
      case 'avatar':
        return `
          width: 40px;
          height: 40px;
        `;
      case 'card':
        return `
          width: 100%;
          height: 200px;
        `;
      default:
        return `
          width: 100%;
          height: 20px;
        `;
    }
  }}
`;

export const LoadingSkeleton = ({ variant = 'text', rounded = false, count = 1, ...props }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} $variant={variant} $rounded={rounded} {...props} />
    ))}
  </>
);

// Full Page Loading
const FullPageContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  z-index: ${({ theme }) => theme.zIndex.modal};
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export const LoadingFullPage = ({ text = 'Loading...', ...props }) => (
  <FullPageContainer {...props}>
    <LoadingSpinner size="large" />
    <LoadingText>{text}</LoadingText>
  </FullPageContainer>
);

// Default Export - Compound Component
const Loading = ({ type = 'spinner', ...props }) => {
  switch (type) {
    case 'dots':
      return <LoadingDots {...props} />;
    case 'progress':
      return <LoadingProgress {...props} />;
    case 'skeleton':
      return <LoadingSkeleton {...props} />;
    case 'fullpage':
      return <LoadingFullPage {...props} />;
    default:
      return <LoadingSpinner {...props} />;
  }
};

Loading.Spinner = LoadingSpinner;
Loading.Dots = LoadingDots;
Loading.Progress = LoadingProgress;
Loading.Skeleton = LoadingSkeleton;
Loading.FullPage = LoadingFullPage;

export default Loading;
