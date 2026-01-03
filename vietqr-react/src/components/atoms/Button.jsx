import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  /* Base Styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  border: none;
  transition: all ${({ theme }) => theme.transition.fast};
  
  /* Size Variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'xs':
        return `
          font-size: ${theme.typography.fontSize.xs};
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          border-radius: ${theme.borderRadius.sm};
        `;
      case 'sm':
        return `
          font-size: ${theme.typography.fontSize.sm};
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          border-radius: ${theme.borderRadius.base};
        `;
      case 'lg':
        return `
          font-size: ${theme.typography.fontSize.lg};
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          border-radius: ${theme.borderRadius.md};
        `;
      case 'xl':
        return `
          font-size: ${theme.typography.fontSize.xl};
          padding: ${theme.spacing[5]} ${theme.spacing[10]};
          border-radius: ${theme.borderRadius.lg};
        `;
      default: // md
        return `
          font-size: ${theme.typography.fontSize.base};
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          border-radius: ${theme.borderRadius.base};
        `;
    }
  }}
  
  /* Variant Styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: #0F172A;  /* Dark text for Amber contrast */
          box-shadow: ${theme.shadows.sm};
          font-weight: 600;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
            box-shadow: ${theme.shadows.base};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.primaryActive};
            box-shadow: ${theme.shadows.xs};
            transform: translateY(0);
          }
        `;

      case 'secondary':
        return `
          background: ${theme.colors.surface.default};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.default};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.surface.hover};
            border-color: ${theme.colors.border.hover};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.surface.active};
          }
        `;

      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.surface.hover};
            color: ${theme.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.surface.active};
          }
        `;

      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.sm};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[600]};
            box-shadow: ${theme.shadows.base};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.error[700]};
            box-shadow: ${theme.shadows.xs};
            transform: translateY(0);
          }
        `;

      case 'success':
        return `
          background: ${theme.colors.success};
          color: #FFFFFF;
          box-shadow: ${theme.shadows.sm};
          font-weight: 600;
          
          &:hover:not(:disabled) {
            filter: brightness(1.1);
            box-shadow: ${theme.shadows.base};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            filter: brightness(0.95);
            box-shadow: ${theme.shadows.xs};
            transform: translateY(0);
          }
        `;

      case 'warning':
        return `
          background: ${theme.colors.warning || '#F59E0B'};
          color: #0F172A;
          box-shadow: ${theme.shadows.sm};
          font-weight: 600;
          
          &:hover:not(:disabled) {
            filter: brightness(1.1);
            box-shadow: ${theme.shadows.base};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            filter: brightness(0.95);
            box-shadow: ${theme.shadows.xs};
            transform: translateY(0);
          }
        `;

      default:
        return `
          background: ${theme.colors.primary};
          color: #0F172A;
          font-weight: 600;
        `;
    }
  }}
  
  /* Full Width */
  ${({ $fullWidth }) => $fullWidth && `
    width: 100%;
  `}
  
  /* Disabled State */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* Loading State */
  ${({ $loading }) => $loading && `
    cursor: wait;
    opacity: 0.7;
  `}
  
  /* Icon Styles */
  svg {
    width: 1.25em;
    height: 1.25em;
    flex-shrink: 0;
  }
`;

const LoadingSpinner = styled(motion.span)`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </StyledButton>
  );
};

export default Button;
