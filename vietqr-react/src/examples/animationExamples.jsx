/**
 * Animation Examples & Usage Guide
 * Demonstrates how to use animation utilities
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Presets
  pageTransition,
  cardHover,
  listItemStagger,
  modalContent,
  toastSlide,
  shakeError,
  
  // Hooks
  useScrollAnimation,
  useStaggerAnimation,
  useShakeAnimation,
  useCountUp,
  useModalAnimation,
  
  // Components
  AnimatedPage,
  AnimatedCard,
  StaggeredList,
  FadeInWhenVisible,
  SkeletonLoader,
  LoadingDots,
  Spinner,
  CollapseContainer,
  ProgressBar,
  CountUpNumber,
} from '../animations';

// ============================================
// Example 1: Animated Page Transitions
// ============================================

export const PageTransitionExample = () => {
  return (
    <AnimatedPage variant="slide">
      <div>
        <h1>Welcome to the Page</h1>
        <p>This page animates in with a slide effect</p>
      </div>
    </AnimatedPage>
  );
};

// ============================================
// Example 2: Animated Cards with Hover
// ============================================

export const AnimatedCardExample = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      <AnimatedCard>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3>Card 1</h3>
          <p>Hover me!</p>
        </div>
      </AnimatedCard>
      
      <AnimatedCard>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3>Card 2</h3>
          <p>Hover me too!</p>
        </div>
      </AnimatedCard>
      
      <AnimatedCard>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3>Card 3</h3>
          <p>And me!</p>
        </div>
      </AnimatedCard>
    </div>
  );
};

// ============================================
// Example 3: Staggered List Animation
// ============================================

export const StaggeredListExample = () => {
  const items = [
    'First item appears',
    'Then second item',
    'Then third item',
    'And so on...',
    'Beautiful stagger effect!',
  ];

  return (
    <StaggeredList stagger={0.1}>
      {items.map((item, index) => (
        <div 
          key={index}
          style={{ 
            padding: '15px', 
            background: 'white', 
            marginBottom: '10px',
            borderRadius: '8px',
          }}
        >
          {item}
        </div>
      ))}
    </StaggeredList>
  );
};

// ============================================
// Example 4: Scroll-Triggered Animations
// ============================================

export const ScrollAnimationExample = () => {
  return (
    <div>
      <FadeInWhenVisible direction="up">
        <h2>This fades in from bottom when scrolled into view</h2>
      </FadeInWhenVisible>
      
      <FadeInWhenVisible direction="left">
        <p>This slides in from left</p>
      </FadeInWhenVisible>
      
      <FadeInWhenVisible direction="right">
        <p>This slides in from right</p>
      </FadeInWhenVisible>
      
      <FadeInWhenVisible direction="scale">
        <div style={{ padding: '20px', background: 'white' }}>
          This scales up
        </div>
      </FadeInWhenVisible>
    </div>
  );
};

// ============================================
// Example 5: Form Validation with Shake
// ============================================

export const ShakeErrorExample = () => {
  const { shake, triggerShake } = useShakeAnimation();
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Invalid input!');
    triggerShake();
    
    setTimeout(() => setError(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div animate={shake}>
        <input 
          type="text" 
          placeholder="Enter something..."
          style={{ 
            padding: '10px', 
            borderRadius: '8px',
            border: error ? '2px solid red' : '2px solid #ccc',
          }}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'red', marginTop: '5px' }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
      <button type="submit" style={{ marginTop: '10px' }}>
        Submit (will show error)
      </button>
    </form>
  );
};

// ============================================
// Example 6: Count Up Animation
// ============================================

export const CountUpExample = () => {
  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <div>
        <h3>Revenue</h3>
        <CountUpNumber 
          end={1234567} 
          duration={2000}
          prefix="$"
        />
      </div>
      
      <div>
        <h3>Users</h3>
        <CountUpNumber 
          end={45678} 
          duration={1500}
          suffix=" users"
        />
      </div>
      
      <div>
        <h3>Success Rate</h3>
        <CountUpNumber 
          end={98.5} 
          duration={1000}
          decimals={1}
          suffix="%"
        />
      </div>
    </div>
  );
};

// ============================================
// Example 7: Loading States
// ============================================

export const LoadingStatesExample = () => {
  return (
    <div>
      <h3>Skeleton Loaders</h3>
      <SkeletonLoader width="100%" height="60px" />
      <div style={{ marginTop: '10px' }}>
        <SkeletonLoader width="80%" height="20px" count={3} />
      </div>
      
      <h3 style={{ marginTop: '30px' }}>Loading Dots</h3>
      <LoadingDots />
      
      <h3 style={{ marginTop: '30px' }}>Spinner</h3>
      <Spinner size="50px" />
    </div>
  );
};

// ============================================
// Example 8: Collapse/Expand Animation
// ============================================

export const CollapseExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide' : 'Show'} Content
      </button>
      
      <CollapseContainer isOpen={isOpen}>
        <div style={{ padding: '20px', background: 'white', marginTop: '10px' }}>
          <h4>Collapsed Content</h4>
          <p>This content animates smoothly when toggled</p>
          <p>Height is calculated automatically</p>
        </div>
      </CollapseContainer>
    </div>
  );
};

// ============================================
// Example 9: Progress Bar
// ============================================

export const ProgressBarExample = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h3>Upload Progress: {progress}%</h3>
      <ProgressBar progress={progress} />
    </div>
  );
};

// ============================================
// Example 10: Modal Animation
// ============================================

export const ModalAnimationExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { backdropVariants, contentVariants } = useModalAnimation();

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
              }}
            />
            
            {/* Modal Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                zIndex: 1001,
                minWidth: '400px',
              }}
            >
              <h2>Animated Modal</h2>
              <p>This modal has smooth entrance and exit animations</p>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Example 11: Manual Animation with Presets
// ============================================

export const ManualAnimationExample = () => {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      style={{ padding: '20px', background: 'white' }}
    >
      <h3>Using Animation Presets Manually</h3>
      <p>You can import and use presets directly with motion components</p>
    </motion.div>
  );
};

// ============================================
// Example 12: Custom Hook - Scroll Animation
// ============================================

export const CustomHookExample = () => {
  const { ref, inView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px', background: 'white', marginTop: '100px' }}
    >
      <h3>Using Custom Hook</h3>
      <p>This uses useScrollAnimation hook to trigger when scrolled into view</p>
    </motion.div>
  );
};

// ============================================
// Complete Demo Component
// ============================================

export const AnimationDemoPage = () => {
  return (
    <AnimatedPage>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Animation Examples</h1>
        
        <section style={{ marginBottom: '60px' }}>
          <h2>1. Page Transitions</h2>
          <PageTransitionExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>2. Animated Cards</h2>
          <AnimatedCardExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>3. Staggered Lists</h2>
          <StaggeredListExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>4. Scroll Animations</h2>
          <ScrollAnimationExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>5. Form Validation</h2>
          <ShakeErrorExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>6. Count Up Numbers</h2>
          <CountUpExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>7. Loading States</h2>
          <LoadingStatesExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>8. Collapse/Expand</h2>
          <CollapseExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>9. Progress Bar</h2>
          <ProgressBarExample />
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2>10. Modal Animation</h2>
          <ModalAnimationExample />
        </section>
      </div>
    </AnimatedPage>
  );
};

export default {
  PageTransitionExample,
  AnimatedCardExample,
  StaggeredListExample,
  ScrollAnimationExample,
  ShakeErrorExample,
  CountUpExample,
  LoadingStatesExample,
  CollapseExample,
  ProgressBarExample,
  ModalAnimationExample,
  ManualAnimationExample,
  CustomHookExample,
  AnimationDemoPage,
};
