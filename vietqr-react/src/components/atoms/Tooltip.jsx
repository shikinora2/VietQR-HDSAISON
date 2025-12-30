import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled(motion.div)`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.fontFamily};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  white-space: nowrap;
  pointer-events: none;
  max-width: 300px;

  /* Positioning */
  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom':
        return `
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return `
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return '';
    }
  }}
`;

const Arrow = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray[900]};
  transform: rotate(45deg);

  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        `;
      case 'bottom':
        return `
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        `;
      case 'left':
        return `
          right: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        `;
      case 'right':
        return `
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        `;
      default:
        return '';
    }
  }}
`;

const Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: placement === 'top' ? 5 : placement === 'bottom' ? -5 : 0,
      x: placement === 'left' ? 5 : placement === 'right' ? -5 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <TooltipWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && content && (
          <TooltipContent
            $placement={placement}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.15 }}
          >
            {content}
            <Arrow $placement={placement} />
          </TooltipContent>
        )}
      </AnimatePresence>
    </TooltipWrapper>
  );
};

export default Tooltip;
