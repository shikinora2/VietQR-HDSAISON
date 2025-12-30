/**
 * Animation Hooks
 * Custom hooks for common animation patterns
 */

import { useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Hook for scroll-triggered animations
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} { ref, controls, inView }
 */
export const useScrollAnimation = (options = {}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    once: true,
    margin: '-50px',
    ...options,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

/**
 * Hook for staggered children animations
 * @param {number} staggerDelay - Delay between children (seconds)
 * @returns {Object} Animation variants
 */
export const useStaggerAnimation = (staggerDelay = 0.05) => {
  return {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
    },
  };
};

/**
 * Hook for hover animations with state
 * @returns {Object} { isHovered, hoverHandlers }
 */
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return { isHovered, hoverHandlers };
};

/**
 * Hook for ripple effect animation
 * @returns {Object} { ripples, createRipple }
 */
export const useRipple = () => {
  const [ripples, setRipples] = React.useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return { ripples, createRipple };
};

/**
 * Hook for shake animation (validation errors)
 * @returns {Object} { shake, triggerShake }
 */
export const useShakeAnimation = () => {
  const controls = useAnimation();

  const triggerShake = async () => {
    await controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    });
  };

  return { shake: controls, triggerShake };
};

/**
 * Hook for count up animation
 * @param {number} end - Target number
 * @param {number} duration - Animation duration in ms
 * @returns {number} Current animated value
 */
export const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out quad
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));

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
  }, [end, duration]);

  return count;
};

/**
 * Hook for progress bar animation
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Object} Animation controls
 */
export const useProgressAnimation = (progress) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  }, [progress, controls]);

  return controls;
};

/**
 * Hook for page transition animations
 * @param {string} direction - 'forward' or 'backward'
 * @returns {Object} Page transition variants
 */
export const usePageTransition = (direction = 'forward') => {
  const variants = {
    initial: {
      opacity: 0,
      x: direction === 'forward' ? 30 : -30,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      x: direction === 'forward' ? -30 : 30,
      transition: { duration: 0.2 },
    },
  };

  return variants;
};

/**
 * Hook for modal animations with backdrop
 * @returns {Object} { backdropVariants, contentVariants }
 */
export const useModalAnimation = () => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return { backdropVariants, contentVariants };
};

/**
 * Hook for tooltip animations
 * @param {string} placement - 'top' | 'bottom' | 'left' | 'right'
 * @returns {Object} Tooltip animation variants
 */
export const useTooltipAnimation = (placement = 'top') => {
  const offsets = {
    top: { y: 10 },
    bottom: { y: -10 },
    left: { x: 10 },
    right: { x: -10 },
  };

  return {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      ...offsets[placement],
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.15, ease: 'easeOut' },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };
};

/**
 * Hook for collapse/expand animations
 * @returns {Object} Collapse animation variants
 */
export const useCollapseAnimation = () => {
  return {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
  };
};

/**
 * Hook for drawer animations
 * @param {string} side - 'left' | 'right' | 'bottom'
 * @returns {Object} Drawer animation variants
 */
export const useDrawerAnimation = (side = 'left') => {
  const variants = {
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
      exit: { x: '100%' },
    },
    bottom: {
      hidden: { y: '100%' },
      visible: { y: 0 },
      exit: { y: '100%' },
    },
  };

  return {
    ...variants[side],
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  };
};

/**
 * Hook for sequential animations
 * @param {Array} steps - Array of animation steps
 * @returns {Object} { currentStep, nextStep, controls }
 */
export const useSequentialAnimation = (steps = []) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const controls = useAnimation();

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      await controls.start(steps[currentStep + 1]);
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    if (steps.length > 0) {
      controls.start(steps[0]);
    }
  }, [steps, controls]);

  return { currentStep, nextStep, controls };
};

/**
 * Hook for loading animations
 * @param {boolean} isLoading - Loading state
 * @returns {Object} Loading animation variants
 */
export const useLoadingAnimation = (isLoading) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading) {
      controls.start({
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      });
    } else {
      controls.stop();
      controls.set({ opacity: 1 });
    }
  }, [isLoading, controls]);

  return controls;
};

/**
 * Hook for notification badge bounce
 * @param {number} count - Notification count
 * @returns {Object} Badge animation controls
 */
export const useBadgeAnimation = (count) => {
  const controls = useAnimation();
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      // New notification - bounce
      controls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      });
    }
    prevCount.current = count;
  }, [count, controls]);

  return controls;
};

/**
 * Hook for card flip animation
 * @param {boolean} isFlipped - Flip state
 * @returns {Object} { frontVariants, backVariants }
 */
export const useCardFlip = (isFlipped) => {
  const frontVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const backVariants = {
    front: { rotateY: -180 },
    back: { rotateY: 0 },
  };

  return {
    frontVariants,
    backVariants,
    animate: isFlipped ? 'back' : 'front',
    transition: { duration: 0.6 },
  };
};

export default {
  useScrollAnimation,
  useStaggerAnimation,
  useHoverAnimation,
  useRipple,
  useShakeAnimation,
  useCountUp,
  useProgressAnimation,
  usePageTransition,
  useModalAnimation,
  useTooltipAnimation,
  useCollapseAnimation,
  useDrawerAnimation,
  useSequentialAnimation,
  useLoadingAnimation,
  useBadgeAnimation,
  useCardFlip,
};
