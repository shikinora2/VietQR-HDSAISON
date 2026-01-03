import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme, $rounded }) => {
    switch ($rounded) {
      case 'sm': return theme.borderRadius.sm;
      case 'lg': return theme.borderRadius.lg;
      case 'xl': return theme.borderRadius.xl;
      case 'none': return theme.borderRadius.none;
      default: return theme.borderRadius.base;
    }
  }};
  box-shadow: ${({ theme, $elevated }) =>
    $elevated ? theme.shadows.base : theme.shadows.none
  };
  transition: all ${({ theme }) => theme.transition.base};
  overflow: hidden;
  
  /* Padding Variants */
  padding: ${({ theme, $padding }) => {
    switch ($padding) {
      case 'none': return 0;
      case 'sm': return theme.spacing[3];
      case 'lg': return theme.spacing[8];
      case 'xl': return theme.spacing[12];
      default: return theme.spacing[6];
    }
  }};
  
  /* Hover Effect */
  ${({ $hoverable, theme }) => $hoverable && `
    cursor: pointer;
    
    &:hover {
      border-color: ${theme.colors.border.hover};
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: ${theme.shadows.sm};
    }
  `}
  
  /* Disabled State */
  ${({ $disabled, theme }) => $disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: ${theme.shadows.none};
    }
  `}
  
  /* Variant: Glass (Legacy/Premium UI) */
  ${({ theme, $variant }) => $variant === 'glass' && `
    background: rgba(30, 41, 59, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(248, 250, 252, 0.2);
    box-shadow: ${theme.shadows.card || theme.shadows.xl};
  `}
`;

const CardHeader = styled.div`
  padding: ${({ theme, $compact }) =>
    $compact ? theme.spacing[4] : theme.spacing[6]
  };
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  
  ${({ $noBorder }) => $noBorder && `
    border-bottom: none;
    padding-bottom: 0;
  `}
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing[2]} 0 0 0;
`;

const CardBody = styled.div`
  padding: ${({ theme, $compact }) =>
    $compact ? theme.spacing[4] : theme.spacing[6]
  };
`;

const CardFooter = styled.div`
  padding: ${({ theme, $compact }) =>
    $compact ? theme.spacing[4] : theme.spacing[6]
  };
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  
  ${({ $noBorder }) => $noBorder && `
    border-top: none;
    padding-top: 0;
  `}
  
  ${({ $justify }) => $justify && `
    justify-content: ${$justify};
  `}
`;

const Card = ({
  children,
  padding = 'md',
  rounded = 'md',
  elevated = false,
  hoverable = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      $padding={padding}
      $rounded={rounded}
      $elevated={elevated}
      $hoverable={hoverable}
      $disabled={disabled}
      $variant={props.variant} // Pass variant prop
      onClick={!disabled ? onClick : undefined}
      whileHover={hoverable && !disabled ? { y: -2 } : {}}
      whileTap={hoverable && !disabled ? { y: 0 } : {}}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
