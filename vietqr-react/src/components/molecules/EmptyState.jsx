import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.lg}`};
  text-align: center;
  min-height: ${({ $minHeight }) => $minHeight || '400px'};
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '64px';
      case 'large': return '128px';
      default: return '96px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '64px';
      case 'large': return '128px';
      default: return '96px';
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray[400]};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const IllustrationWrapper = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 300px;

  img {
    width: 100%;
    height: auto;
  }
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  max-width: 500px;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const EmptyState = ({
  icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  minHeight,
  size = 'medium',
}) => {
  return (
    <EmptyStateContainer $minHeight={minHeight}>
      {illustration && (
        <IllustrationWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {typeof illustration === 'string' ? (
            <img src={illustration} alt={title || 'Empty state'} />
          ) : (
            illustration
          )}
        </IllustrationWrapper>
      )}

      {!illustration && icon && (
        <IconWrapper
          $size={size}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {icon}
        </IconWrapper>
      )}

      {title && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Title>{title}</Title>
        </motion.div>
      )}

      {description && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Description>{description}</Description>
        </motion.div>
      )}

      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Actions>
            {action}
            {secondaryAction}
          </Actions>
        </motion.div>
      )}
    </EmptyStateContainer>
  );
};

export default EmptyState;
