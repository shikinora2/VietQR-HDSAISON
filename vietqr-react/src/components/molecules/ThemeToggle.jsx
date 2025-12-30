/**
 * Theme Toggle Component
 * Beautiful animated toggle for switching between light/dark/auto modes
 */

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../styles/ThemeProvider';
import Tooltip from '../atoms/Tooltip';

const ToggleButton = styled(motion.button)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.background.elevated};
  border: 1px solid ${props => props.theme.colors.border.main};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.colors.action.hover};
    border-color: ${props => props.theme.colors.border.dark};
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const IconWrapper = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const iconVariants = {
  initial: { 
    scale: 0,
    rotate: -180,
    opacity: 0,
  },
  animate: { 
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: { 
    scale: 0,
    rotate: 180,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const ThemeToggle = ({ size = 'md', showTooltip = true, ...props }) => {
  const { themeMode, cycleTheme, isDarkMode } = useTheme();

  const icons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    auto: <Monitor size={20} />,
  };

  const tooltips = {
    light: 'Chế độ sáng',
    dark: 'Chế độ tối',
    auto: 'Tự động (theo hệ thống)',
  };

  const button = (
    <ToggleButton
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <IconWrapper
          key={themeMode}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {icons[themeMode]}
        </IconWrapper>
      </AnimatePresence>
    </ToggleButton>
  );

  if (showTooltip) {
    return (
      <Tooltip content={tooltips[themeMode]} placement="bottom">
        {button}
      </Tooltip>
    );
  }

  return button;
};

// ============================================
// Theme Toggle with Dropdown Menu
// ============================================

const ToggleMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props => props.theme.colors.background.elevated};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[2]};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 180px;
  z-index: ${props => props.theme.zIndex.dropdown};
`;

const MenuItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active 
    ? props.theme.colors.action.selected 
    : 'transparent'};
  border: none;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.action.hover};
  }

  svg {
    color: ${props => props.active 
      ? props.theme.colors.primary.main 
      : props.theme.colors.text.secondary};
  }
`;

const Label = styled.span`
  flex: 1;
`;

const Checkmark = styled(motion.div)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
`;

export const ThemeToggleMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { themeMode, setTheme } = useTheme();
  const menuRef = React.useRef(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    { value: 'light', label: 'Chế độ sáng', icon: <Sun size={18} /> },
    { value: 'dark', label: 'Chế độ tối', icon: <Moon size={18} /> },
    { value: 'auto', label: 'Tự động', icon: <Monitor size={18} /> },
  ];

  const currentIcon = options.find(opt => opt.value === themeMode)?.icon;

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <ToggleButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Theme menu"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          <IconWrapper
            key={themeMode}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentIcon}
          </IconWrapper>
        </AnimatePresence>
      </ToggleButton>

      <AnimatePresence>
        {isOpen && (
          <ToggleMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                active={themeMode === option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.icon}
                <Label>{option.label}</Label>
                <AnimatePresence>
                  {themeMode === option.value && (
                    <Checkmark
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </MenuItem>
            ))}
          </ToggleMenu>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Compact Toggle (Icon Only)
// ============================================

export const ThemeToggleCompact = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <IconWrapper
          key={isDarkMode ? 'dark' : 'light'}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </IconWrapper>
      </AnimatePresence>
    </ToggleButton>
  );
};

export default ThemeToggle;