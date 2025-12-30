import styled from 'styled-components';

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  /* Size Variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          font-size: ${theme.typography.fontSize.xs};
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
        `;
      case 'lg':
        return `
          font-size: ${theme.typography.fontSize.base};
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
        `;
      default: // md
        return `
          font-size: ${theme.typography.fontSize.sm};
          padding: ${theme.spacing[1]} ${theme.spacing[3]};
        `;
    }
  }}
  
  /* Variant Styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return `
          background: ${theme.colors.successLight};
          color: ${theme.colors.success[700]};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning[700]};
        `;
      case 'error':
        return `
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error[700]};
        `;
      case 'info':
        return `
          background: ${theme.colors.infoLight};
          color: ${theme.colors.info[700]};
        `;
      case 'secondary':
        return `
          background: ${theme.colors.bg.tertiary};
          color: ${theme.colors.text.secondary};
        `;
      default: // primary
        return `
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `;
    }
  }}
  
  /* Dot Indicator */
  ${({ $dot, theme }) => $dot && `
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      margin-right: ${theme.spacing[1]};
    }
  `}
  
  svg {
    width: 1em;
    height: 1em;
  }
`;

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  ...props
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      $dot={dot}
      {...props}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;
