/**
 * Animation Components
 * Ready-to-use animated components
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import * as animations from './animations';

// ============================================
// Animated Page Wrapper
// ============================================

export const AnimatedPage = ({ children, variant = 'slide' }) => {
  const variants = {
    slide: animations.pageSlide,
    fade: animations.pageFade,
    scale: animations.pageScale,
    default: animations.pageTransition,
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={selectedVariant.transition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Animated Card
// ============================================

export const AnimatedCard = ({ 
  children, 
  hover = true, 
  tap = true,
  ...props 
}) => {
  return (
    <motion.div
      initial="rest"
      whileHover={hover ? "hover" : undefined}
      whileTap={tap ? "tap" : undefined}
      variants={animations.cardHover}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Staggered List
// ============================================

export const StaggeredList = ({ children, stagger = 0.05 }) => {
  const variants = {
    container: {
      animate: {
        transition: {
          staggerChildren: stagger,
          delayChildren: 0.1,
        },
      },
    },
    item: animations.listItemStagger.item,
  };

  return (
    <motion.div
      variants={variants.container}
      initial="initial"
      animate="animate"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={variants.item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================
// Staggered Grid
// ============================================

export const StaggeredGrid = ({ children, stagger = 0.03 }) => {
  const variants = {
    container: {
      animate: {
        transition: {
          staggerChildren: stagger,
        },
      },
    },
    item: animations.gridItemStagger.item,
  };

  return (
    <motion.div
      variants={variants.container}
      initial="initial"
      animate="animate"
      style={{ display: 'grid' }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={variants.item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================
// Fade In When Visible
// ============================================

export const FadeInWhenVisible = ({ children, direction = 'up' }) => {
  const variants = {
    up: animations.fadeInUp,
    left: animations.fadeInLeft,
    right: animations.fadeInRight,
    scale: animations.scaleIn,
  };

  const selectedVariant = variants[direction] || variants.up;

  return (
    <motion.div
      initial={selectedVariant.initial}
      whileInView={selectedVariant.whileInView}
      viewport={selectedVariant.viewport}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Animated Button
// ============================================

export const AnimatedButton = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ============================================
// Skeleton Loader
// ============================================

const SkeletonBox = styled(motion.div)`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.tertiary} 25%,
    ${props => props.theme.colors.background.secondary} 50%,
    ${props => props.theme.colors.background.tertiary} 75%
  );
  background-size: 200% 100%;
  border-radius: ${props => props.theme.borderRadius.md};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

export const SkeletonLoader = ({ width, height, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBox
          key={index}
          width={width}
          height={height}
          animate={animations.skeletonShimmer.animate}
          style={{ marginBottom: count > 1 ? '12px' : '0' }}
        />
      ))}
    </>
  );
};

// ============================================
// Loading Dots
// ============================================

const DotsContainer = styled(motion.div)`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary.main};
`;

export const LoadingDots = () => {
  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <DotsContainer>
      {[0, 1, 2].map((i) => (
        <Dot
          key={i}
          variants={dotVariants}
          animate="animate"
          transition={{ delay: i * 0.15 }}
        />
      ))}
    </DotsContainer>
  );
};

// ============================================
// Spinner
// ============================================

const SpinnerCircle = styled(motion.div)`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${props => props.theme.colors.background.tertiary};
  border-top-color: ${props => props.theme.colors.primary.main};
  border-radius: 50%;
`;

export const Spinner = ({ size }) => {
  return (
    <SpinnerCircle
      size={size}
      animate={animations.spinnerRotate.animate}
    />
  );
};

// ============================================
// Pulse Badge
// ============================================

const PulseDot = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color || props.theme.colors.error.main};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 2px solid ${props => props.color || props.theme.colors.error.main};
    opacity: 0.5;
  }
`;

export const PulseBadge = ({ color }) => {
  return (
    <PulseDot
      color={color}
      animate={animations.notificationDot.animate}
    />
  );
};

// ============================================
// Collapse Container
// ============================================

export const CollapseContainer = ({ isOpen, children }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={animations.collapse.initial}
          animate={animations.collapse.animate}
          exit={animations.collapse.exit}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Modal Backdrop
// ============================================

export const ModalBackdrop = ({ children, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={animations.modalBackdrop.initial}
        animate={animations.modalBackdrop.animate}
        exit={animations.modalBackdrop.exit}
        transition={animations.modalBackdrop.transition}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      >
        <motion.div
          initial={animations.modalContent.initial}
          animate={animations.modalContent.animate}
          exit={animations.modalContent.exit}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// Drawer
// ============================================

export const Drawer = ({ isOpen, side = 'left', children, onClose }) => {
  const variants = animations.drawerSlide[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />
          
          {/* Drawer content */}
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
            style={{
              position: 'fixed',
              [side]: 0,
              top: 0,
              bottom: 0,
              zIndex: 1001,
              backgroundColor: 'white',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Progress Bar
// ============================================

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.primary.main},
    ${props => props.theme.colors.primary.light}
  );
  border-radius: ${props => props.theme.borderRadius.full};
`;

export const ProgressBar = ({ progress = 0 }) => {
  return (
    <ProgressBarContainer>
      <ProgressBarFill
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </ProgressBarContainer>
  );
};

// ============================================
// Tooltip Wrapper
// ============================================

export const AnimatedTooltip = ({ children, isVisible, placement = 'top' }) => {
  const variants = animations.popoverSlide[placement];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={variants.transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Count Up Number
// ============================================

export const CountUpNumber = ({ end, duration = 1000, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeProgress * end;
      
      setCount(decimals > 0 ? currentCount.toFixed(decimals) : Math.floor(currentCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, decimals]);

  return <span>{prefix}{count}{suffix}</span>;
};

export default {
  AnimatedPage,
  AnimatedCard,
  StaggeredList,
  StaggeredGrid,
  FadeInWhenVisible,
  AnimatedButton,
  SkeletonLoader,
  LoadingDots,
  Spinner,
  PulseBadge,
  CollapseContainer,
  ModalBackdrop,
  Drawer,
  ProgressBar,
  AnimatedTooltip,
  CountUpNumber,
};
