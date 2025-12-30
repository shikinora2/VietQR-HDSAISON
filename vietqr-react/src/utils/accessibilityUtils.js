import React from 'react';

/**
 * Accessibility Utilities
 * Helper functions for improved accessibility
 */

/**
 * Focus Trap - Traps focus within a container
 * Useful for modals, dropdowns, and other overlay elements
 */
export class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  activate() {
    // Get all focusable elements
    this.focusableElements = this.element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );

    if (this.focusableElements.length === 0) return;

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    // Add event listener
    this.element.addEventListener('keydown', this.handleKeyDown);

    // Focus first element
    this.firstFocusable.focus();
  }

  deactivate() {
    this.element.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }
}

/**
 * Create a focus trap hook
 */
export const useFocusTrap = (ref, active = true) => {
  const trapRef = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !active) return;

    trapRef.current = new FocusTrap(ref.current);
    trapRef.current.activate();

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
    };
  }, [ref, active]);

  return trapRef;
};

/**
 * Keyboard Navigation Handler
 */
export const useKeyboardNavigation = (items, onSelect, options = {}) => {
  const {
    loop = true,
    orientation = 'vertical',
    disabled = false,
  } = options;

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleKeyDown = React.useCallback((e) => {
    if (disabled || !items.length) return;

    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev + 1;
          if (next >= items.length) {
            return loop ? 0 : prev;
          }
          return next;
        });
        break;

      case prevKey:
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev - 1;
          if (next < 0) {
            return loop ? items.length - 1 : 0;
          }
          return next;
        });
        break;

      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onSelect) {
          onSelect(items[activeIndex], activeIndex);
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (options.onEscape) {
          options.onEscape();
        }
        break;

      default:
        break;
    }
  }, [items, activeIndex, orientation, loop, disabled, onSelect, options]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
};

/**
 * ARIA Announcer - Announces messages to screen readers
 */
export class AriaAnnouncer {
  constructor() {
    this.liveRegion = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Create live region if it doesn't exist
    this.liveRegion = document.getElementById('aria-live-region');
    
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'aria-live-region';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.setAttribute('role', 'status');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.left = '-10000px';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.overflow = 'hidden';
      document.body.appendChild(this.liveRegion);
    }
  }

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  }
}

// Global announcer instance
export const announcer = new AriaAnnouncer();

/**
 * Announce message to screen readers
 */
export const announce = (message, priority = 'polite') => {
  announcer.announce(message, priority);
};

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export const generateId = (prefix = 'id') => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Skip Link for keyboard navigation
 */
export const createSkipLink = (targetId, label = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  return skipLink;
};

/**
 * Detect if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get accessible label for element
 */
export const getAccessibleLabel = (element) => {
  if (!element) return '';

  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // Check for label element
  const id = element.getAttribute('id');
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent;
  }

  // Fallback to placeholder or title
  return element.getAttribute('placeholder') || element.getAttribute('title') || '';
};

/**
 * Check if element is focusable
 */
export const isFocusable = (element) => {
  if (!element) return false;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
};

/**
 * Move focus to element
 */
export const moveFocusTo = (element, options = {}) => {
  if (!element) return;

  const {
    preventScroll = false,
    delay = 0,
  } = options;

  setTimeout(() => {
    element.focus({ preventScroll });
  }, delay);
};

/**
 * Restore focus to previous element
 */
export const createFocusMemory = () => {
  let previouslyFocused = null;

  return {
    save: () => {
      previouslyFocused = document.activeElement;
    },
    restore: () => {
      if (previouslyFocused && isFocusable(previouslyFocused)) {
        moveFocusTo(previouslyFocused);
      }
    },
  };
};

/**
 * ARIA attributes builder
 */
export const buildAriaAttributes = (config = {}) => {
  const attrs = {};

  if (config.label) attrs['aria-label'] = config.label;
  if (config.labelledBy) attrs['aria-labelledby'] = config.labelledBy;
  if (config.describedBy) attrs['aria-describedby'] = config.describedBy;
  if (config.expanded !== undefined) attrs['aria-expanded'] = config.expanded;
  if (config.selected !== undefined) attrs['aria-selected'] = config.selected;
  if (config.checked !== undefined) attrs['aria-checked'] = config.checked;
  if (config.disabled !== undefined) attrs['aria-disabled'] = config.disabled;
  if (config.hidden !== undefined) attrs['aria-hidden'] = config.hidden;
  if (config.controls) attrs['aria-controls'] = config.controls;
  if (config.owns) attrs['aria-owns'] = config.owns;
  if (config.live) attrs['aria-live'] = config.live;
  if (config.atomic !== undefined) attrs['aria-atomic'] = config.atomic;
  if (config.relevant) attrs['aria-relevant'] = config.relevant;
  if (config.busy !== undefined) attrs['aria-busy'] = config.busy;
  if (config.current) attrs['aria-current'] = config.current;
  if (config.invalid !== undefined) attrs['aria-invalid'] = config.invalid;
  if (config.required !== undefined) attrs['aria-required'] = config.required;
  if (config.haspopup) attrs['aria-haspopup'] = config.haspopup;

  return attrs;
};

/**
 * Create accessible tooltip attributes
 */
export const createTooltipAttributes = (tooltipId, visible = false) => {
  return {
    'aria-describedby': visible ? tooltipId : undefined,
    'aria-expanded': visible,
  };
};

/**
 * Create accessible dialog/modal attributes
 */
export const createDialogAttributes = (dialogId, labelId, descriptionId) => {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelId,
    'aria-describedby': descriptionId,
    id: dialogId,
  };
};

/**
 * React hook for managing focus
 */
export const useFocusManagement = () => {
  const focusMemory = React.useMemo(() => createFocusMemory(), []);

  React.useEffect(() => {
    return () => {
      focusMemory.restore();
    };
  }, [focusMemory]);

  return focusMemory;
};

export default {
  FocusTrap,
  useFocusTrap,
  useKeyboardNavigation,
  AriaAnnouncer,
  announce,
  generateId,
  createSkipLink,
  prefersReducedMotion,
  getAccessibleLabel,
  isFocusable,
  moveFocusTo,
  createFocusMemory,
  buildAriaAttributes,
  createTooltipAttributes,
  createDialogAttributes,
  useFocusManagement,
};
