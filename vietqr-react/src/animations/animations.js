/**
 * Framer Motion Animation Presets
 * Reusable animation configurations for consistent UX
 */

// ============================================
// Page Transitions
// ============================================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export const pageSlide = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const pageScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// ============================================
// Card & List Animations
// ============================================

export const cardHover = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  hover: { 
    scale: 1.02,
    y: -4,
    boxShadow: '0 8px 24px rgba(99,102,241,0.15)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const cardPress = {
  tap: { 
    scale: 0.97,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
};

export const listItemStagger = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },
};

export const gridItemStagger = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
  },
  item: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  },
};

// ============================================
// Modal & Overlay Animations
// ============================================

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.2 },
  },
};

export const drawerSlide = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// ============================================
// Toast & Notification Animations
// ============================================

export const toastSlide = {
  topRight: {
    initial: { opacity: 0, x: 100, y: 0 },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: { duration: 0.2 },
    },
  },
  topLeft: {
    initial: { opacity: 0, x: -100, y: 0 },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.2 },
    },
  },
  bottomRight: {
    initial: { opacity: 0, x: 100, y: 0 },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: { duration: 0.2 },
    },
  },
  bottomLeft: {
    initial: { opacity: 0, x: -100, y: 0 },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.2 },
    },
  },
};

// ============================================
// Button & Interactive Element Animations
// ============================================

export const buttonTap = {
  tap: { scale: 0.95 },
  transition: { duration: 0.1 },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: { scale: 0.95 },
};

export const iconSpin = {
  animate: { 
    rotate: 360,
    transition: { 
      duration: 1, 
      repeat: Infinity, 
      ease: 'linear',
    },
  },
};

export const iconPulse = {
  animate: { 
    scale: [1, 1.1, 1],
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: 'easeInOut',
    },
  },
};

export const iconBounce = {
  animate: { 
    y: [0, -10, 0],
    transition: { 
      duration: 0.6, 
      repeat: Infinity, 
      ease: 'easeInOut',
    },
  },
};

// ============================================
// Form Validation Animations
// ============================================

export const shakeError = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

export const errorBounce = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const successPulse = {
  animate: {
    scale: [1, 1.05, 1],
    borderColor: ['#22c55e', '#16a34a', '#22c55e'],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

// ============================================
// Loading & Skeleton Animations
// ============================================

export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: 'easeInOut',
    },
  },
};

export const skeletonShimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: 'linear',
    },
  },
};

export const loadingDots = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  dot: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// Collapse & Expand Animations
// ============================================

export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { 
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
    },
  },
};

export const accordionExpand = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ============================================
// Scroll Reveal Animations
// ============================================

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  viewport: { once: true, margin: '-50px' },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  viewport: { once: true, margin: '-50px' },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  viewport: { once: true, margin: '-50px' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  viewport: { once: true, margin: '-50px' },
};

// ============================================
// Tooltip & Popover Animations
// ============================================

export const tooltipFade = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export const popoverSlide = {
  top: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 },
    transition: { duration: 0.2 },
  },
  bottom: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
    transition: { duration: 0.2 },
  },
  left: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 5 },
    transition: { duration: 0.2 },
  },
  right: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -5 },
    transition: { duration: 0.2 },
  },
};

// ============================================
// Badge & Notification Dot Animations
// ============================================

export const badgeBounce = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
  exit: { scale: 0 },
};

export const notificationDot = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// Progress & Loading Bar Animations
// ============================================

export const progressBar = {
  initial: { width: 0 },
  animate: (progress) => ({ 
    width: `${progress}%`,
    transition: { duration: 0.5, ease: 'easeOut' },
  }),
};

export const loadingBar = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// Custom Spring Configurations
// ============================================

export const springConfigs = {
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
  stiff: {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  },
  slow: {
    type: 'spring',
    stiffness: 80,
    damping: 20,
  },
};

// ============================================
// Easing Functions
// ============================================

export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  standard: [0.4, 0, 0.2, 1],
};

// ============================================
// Combined Presets (Common Use Cases)
// ============================================

export const cardEnter = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: easings.easeOut,
    },
  },
};

export const listEnter = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 },
    },
  },
};

export const fadeScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 },
};

export default {
  // Page transitions
  pageTransition,
  pageSlide,
  pageFade,
  pageScale,
  
  // Card & List
  cardHover,
  cardPress,
  listItemStagger,
  gridItemStagger,
  
  // Modal & Overlay
  modalBackdrop,
  modalContent,
  drawerSlide,
  
  // Toast
  toastSlide,
  
  // Button
  buttonTap,
  buttonHover,
  iconSpin,
  iconPulse,
  iconBounce,
  
  // Form validation
  shakeError,
  errorBounce,
  successPulse,
  
  // Loading
  skeletonPulse,
  skeletonShimmer,
  loadingDots,
  spinnerRotate,
  
  // Collapse
  collapse,
  accordionExpand,
  
  // Scroll reveal
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  
  // Tooltip
  tooltipFade,
  popoverSlide,
  
  // Badge
  badgeBounce,
  notificationDot,
  
  // Progress
  progressBar,
  loadingBar,
  
  // Configs
  springConfigs,
  easings,
  
  // Combined
  cardEnter,
  listEnter,
  fadeScale,
};
