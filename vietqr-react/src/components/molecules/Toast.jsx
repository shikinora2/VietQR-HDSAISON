import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    left: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    top: ${({ theme }) => theme.spacing.md};
  }
`;

const ToastItem = styled(motion.div)`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  min-width: 320px;
  max-width: 480px;
  pointer-events: auto;
  border-left: 4px solid;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `border-left-color: ${theme.colors.success[500]};`;
      case 'error':
        return `border-left-color: ${theme.colors.error[500]};`;
      case 'warning':
        return `border-left-color: ${theme.colors.warning[500]};`;
      case 'info':
        return `border-left-color: ${theme.colors.primary[500]};`;
      default:
        return `border-left-color: ${theme.colors.gray[500]};`;
    }
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: auto;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `color: ${theme.colors.success[500]};`;
      case 'error':
        return `color: ${theme.colors.error[500]};`;
      case 'warning':
        return `color: ${theme.colors.warning[500]};`;
      case 'info':
        return `color: ${theme.colors.primary[500]};`;
      default:
        return `color: ${theme.colors.gray[500]};`;
    }
  }}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transition.base};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'info':
      return <Info size={20} />;
    default:
      return <Info size={20} />;
  }
};

const Toast = ({ id, type, title, description, onClose }) => {
  return (
    <ToastItem
      $type={type}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <IconWrapper $type={type}>{getIcon(type)}</IconWrapper>
      <Content>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </Content>
      <CloseButton onClick={() => onClose(id)}>
        <X size={16} />
      </CloseButton>
    </ToastItem>
  );
};

export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = 'info', title, description, duration = 5000 }) => {
      const id = Date.now() + Math.random();
      const newToast = { id, type, title, description };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [maxToasts]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (title, description, duration) =>
      addToast({ type: 'success', title, description, duration }),
    [addToast]
  );

  const error = useCallback(
    (title, description, duration) =>
      addToast({ type: 'error', title, description, duration }),
    [addToast]
  );

  const warning = useCallback(
    (title, description, duration) =>
      addToast({ type: 'warning', title, description, duration }),
    [addToast]
  );

  const info = useCallback(
    (title, description, duration) =>
      addToast({ type: 'info', title, description, duration }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default Toast;
