import styled from 'styled-components';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const AvatarWrapper = styled(motion.div)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.gray[600]};
  flex-shrink: 0;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          width: 32px;
          height: 32px;
          font-size: 14px;
        `;
      case 'large':
        return `
          width: 64px;
          height: 64px;
          font-size: 24px;
        `;
      case 'xlarge':
        return `
          width: 96px;
          height: 96px;
          font-size: 32px;
        `;
      default:
        return `
          width: 40px;
          height: 40px;
          font-size: 16px;
        `;
    }
  }}

  /* Clickable style */
  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  `}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $color }) => {
    const colors = [
      theme.colors.primary[500],
      theme.colors.success[500],
      theme.colors.accent[500],
      theme.colors.danger[500],
      theme.colors.primary[400],
      theme.colors.success[400],
    ];
    return $color || colors[Math.floor(Math.random() * colors.length)];
  }};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-transform: uppercase;
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '8px';
      case 'large': return '16px';
      case 'xlarge': return '20px';
      default: return '12px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '8px';
      case 'large': return '16px';
      case 'xlarge': return '20px';
      default: return '12px';
    }
  }};
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.background};
  background: ${({ $status, theme }) => {
    switch ($status) {
      case 'online':
        return theme.colors.success[500];
      case 'busy':
        return theme.colors.danger[500];
      case 'away':
        return theme.colors.accent[500];
      default:
        return theme.colors.gray[400];
    }
  }};
`;

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  status,
  fallbackColor,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showFallback = !src || imageError || !imageLoaded;

  return (
    <AvatarWrapper
      $size={size}
      $clickable={!!onClick}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
    >
      {!showFallback && (
        <AvatarImage
          src={src}
          alt={alt || name || 'Avatar'}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {showFallback && (
        <AvatarFallback $color={fallbackColor}>
          {name ? (
            getInitials(name)
          ) : (
            <User size={size === 'small' ? 16 : size === 'large' ? 32 : 20} />
          )}
        </AvatarFallback>
      )}

      {status && <StatusIndicator $status={status} $size={size} />}
    </AvatarWrapper>
  );
};

export default Avatar;
