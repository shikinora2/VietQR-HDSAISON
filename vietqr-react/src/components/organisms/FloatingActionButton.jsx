import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Tooltip from '../atoms/Tooltip';

const FABContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: ${({ theme }) => theme.zIndex.fab};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    bottom: calc(${({ theme }) => theme.spacing.xl} + 64px); /* Above mobile nav */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: calc(${({ theme }) => theme.spacing.lg} + 64px);
    right: ${({ theme }) => theme.spacing.lg};
  }
`;

const MainFAB = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: white;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transition.base};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
  }

  ${({ $open }) => $open && `
    svg {
      transform: rotate(45deg);
    }
  `}
`;

const FABMenu = styled(motion.div)`
  position: absolute;
  bottom: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FABMenuItem = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transition.base};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
    color: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
`;

const FloatingActionButton = ({ actions = [], icon, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    if (actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleActionClick = (action) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <FABContainer>
      <AnimatePresence>
        {isOpen && actions.length > 0 && (
          <>
            <Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <FABMenu
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {actions.map((action, index) => {
                const menuItem = (
                  <FABMenuItem
                    key={action.id || index}
                    onClick={() => handleActionClick(action)}
                    disabled={action.disabled}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {action.icon}
                  </FABMenuItem>
                );

                return action.label ? (
                  <Tooltip key={action.id || index} content={action.label} placement="left">
                    {menuItem}
                  </Tooltip>
                ) : (
                  menuItem
                );
              })}
            </FABMenu>
          </>
        )}
      </AnimatePresence>

      <MainFAB
        onClick={handleMainClick}
        $open={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon || (isOpen ? <X /> : <Plus />)}
      </MainFAB>
    </FABContainer>
  );
};

export default FloatingActionButton;
