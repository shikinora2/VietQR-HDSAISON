import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

/**
 * Loading States Components
 * Various loading indicators for different use cases
 */

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Spinner Loading
const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme, $size }) => {
    if ($size === 'small') return theme.spacing.sm;
    if ($size === 'large') return theme.spacing.xl;
    return theme.spacing.md;
  }};
`;

const SpinnerIcon = styled(Loader)`
  animation: ${spin} 1s linear infinite;
  color: ${({ theme, $color }) => $color || theme.colors.primary};
  width: ${({ $size }) => {
    if ($size === 'small') return '20px';
    if ($size === 'large') return '48px';
    return '32px';
  }};
  height: ${({ $size }) => {
    if ($size === 'small') return '20px';
    if ($size === 'large') return '48px';
    return '32px';
  }};
`;

export const Spinner = ({ size = 'medium', color, ...props }) => (
  <SpinnerContainer $size={size} {...props}>
    <SpinnerIcon $size={size} $color={color} />
  </SpinnerContainer>
);

// Dots Loading
const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
`;

const Dot = styled(motion.div)`
  width: ${({ $size }) => $size === 'small' ? '8px' : '12px'};
  height: ${({ $size }) => $size === 'small' ? '8px' : '12px'};
  border-radius: 50%;
  background: ${({ theme, $color }) => $color || theme.colors.primary};
`;

export const DotsLoader = ({ size = 'medium', color, ...props }) => {
  const dotAnimation = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: { scale: 1.2, opacity: 1 },
  };

  return (
    <DotsContainer {...props}>
      {[0, 1, 2].map((i) => (
        <Dot
          key={i}
          $size={size}
          $color={color}
          variants={dotAnimation}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.2,
          }}
        />
      ))}
    </DotsContainer>
  );
};

// Bar Loading
const BarContainer = styled.div`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '300px'};
  height: ${({ $height }) => $height || '4px'};
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  
  ${({ theme }) => theme.isDark && `
    background: ${theme.colors.gray[700]};
  `}
`;

const BarProgress = styled(motion.div)`
  height: 100%;
  background: ${({ theme, $color }) => $color || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

export const ProgressBar = ({ 
  progress = 0, 
  color, 
  height, 
  maxWidth,
  indeterminate = false,
  ...props 
}) => {
  return (
    <BarContainer $height={height} $maxWidth={maxWidth} {...props}>
      <BarProgress
        $color={color}
        initial={{ width: '0%' }}
        animate={
          indeterminate
            ? {
                width: ['0%', '100%'],
                x: ['-100%', '100%'],
              }
            : { width: `${progress}%` }
        }
        transition={
          indeterminate
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : { duration: 0.3 }
        }
      />
    </BarContainer>
  );
};

// Skeleton Loading
const SkeletonBase = styled.div`
  background: ${({ theme }) => theme.colors.gray[200]};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[200]} 0px,
    ${({ theme }) => theme.colors.gray[300]} 40px,
    ${({ theme }) => theme.colors.gray[200]} 80px
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${({ theme, $radius }) => $radius || theme.borderRadius.md};
  
  ${({ theme }) => theme.isDark && `
    background: ${theme.colors.gray[700]};
    background-image: linear-gradient(
      90deg,
      ${theme.colors.gray[700]} 0px,
      ${theme.colors.gray[600]} 40px,
      ${theme.colors.gray[700]} 80px
    );
  `}
`;

export const SkeletonBox = styled(SkeletonBase)`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
`;

export const SkeletonCircle = styled(SkeletonBase)`
  width: ${({ $size }) => $size || '40px'};
  height: ${({ $size }) => $size || '40px'};
  border-radius: 50%;
`;

export const SkeletonText = ({ lines = 3, gap = '12px', ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        $width={i === lines - 1 ? '60%' : '100%'}
        $height="16px"
      />
    ))}
  </div>
);

// Card Skeleton
const SkeletonCardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SkeletonHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SkeletonCard = ({ withAvatar = true, ...props }) => (
  <SkeletonCardContainer {...props}>
    {withAvatar && (
      <SkeletonHeader>
        <SkeletonCircle $size="48px" />
        <div style={{ flex: 1 }}>
          <SkeletonBox $width="40%" $height="20px" style={{ marginBottom: '8px' }} />
          <SkeletonBox $width="60%" $height="16px" />
        </div>
      </SkeletonHeader>
    )}
    <SkeletonText lines={3} />
  </SkeletonCardContainer>
);

// Full Page Loading
const FullPageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const LoadingText = styled(motion.p)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FullPageLoader = ({ message = 'Loading...', ...props }) => (
  <FullPageContainer {...props}>
    <Spinner size="large" />
    <LoadingText
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {message}
    </LoadingText>
  </FullPageContainer>
);

// Overlay Loading
const OverlayContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

export const OverlayLoader = ({ message, ...props }) => (
  <OverlayContainer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    {...props}
  >
    <div style={{ textAlign: 'center' }}>
      <Spinner size="large" />
      {message && (
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </LoadingText>
      )}
    </div>
  </OverlayContainer>
);

// Pulse Loading (for content that's loading in place)
const PulseContainer = styled.div`
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const PulseLoader = ({ children, ...props }) => (
  <PulseContainer {...props}>{children}</PulseContainer>
);

export default {
  Spinner,
  DotsLoader,
  ProgressBar,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  SkeletonCard,
  FullPageLoader,
  OverlayLoader,
  PulseLoader,
};
