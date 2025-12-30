import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ theme }) => theme.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  min-width: 200px;
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger[600] : theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ theme }) => theme.fontSize.base};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.base};
  position: relative;

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? theme.colors.danger[50] : theme.colors.background.secondary};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[200]};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const DropdownLabel = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CheckIcon = styled(Check)`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (onClick) => {
    if (closeOnSelect) {
      setIsOpen(false);
    }
    if (onClick) onClick();
  };

  return (
    <DropdownWrapper ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <DropdownTrigger onClick={() => setIsOpen(!isOpen)}>
          Open Menu
        </DropdownTrigger>
      )}

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            $align={align}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {typeof children === 'function'
              ? children({ close: () => setIsOpen(false), handleItemClick })
              : children}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownWrapper>
  );
};

// Export sub-components
Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Label = DropdownLabel;
Dropdown.CheckIcon = CheckIcon;

export default Dropdown;
