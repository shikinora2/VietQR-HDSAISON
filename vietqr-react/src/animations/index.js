/**
 * Animation Barrel Export
 * Central export point for all animation utilities
 */

// Animation presets
export * from './animations';

// Animation hooks
export * from './useAnimations';

// Animation components
export * from './AnimationComponents';

// Re-export framer-motion for convenience
export { motion, AnimatePresence, useAnimation } from 'framer-motion';

import animationPresets from './animations';
import animationHooks from './useAnimations';
import animationComponents from './AnimationComponents';

export default {
  presets: animationPresets,
  hooks: animationHooks,
  components: animationComponents,
};
