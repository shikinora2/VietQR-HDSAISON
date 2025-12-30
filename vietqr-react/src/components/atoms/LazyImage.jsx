/**
 * Lazy Image Component with Optimization
 * Progressive image loading with blur effect
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.background.secondary};
`;

const StyledImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.$objectFit || 'cover'};
  object-position: ${props => props.$objectPosition || 'center'};
`;

const BlurPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  transform: scale(1.1);
`;

const Skeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    ${props => props.theme.colors.background.elevated} 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/**
 * Lazy Image Component
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} placeholder - Placeholder image (low-res)
 * @param {string} objectFit - CSS object-fit value
 * @param {string} objectPosition - CSS object-position value
 * @param {Function} onLoad - Load callback
 * @param {Function} onError - Error callback
 */
export const LazyImage = ({
  src,
  alt = '',
  placeholder,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <ImageContainer ref={imgRef} {...props}>
      {/* Skeleton loader */}
      {!isLoaded && !hasError && <Skeleton />}
      
      {/* Blur placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <BlurPlaceholder $src={placeholder} />
      )}
      
      {/* Actual image */}
      {isInView && !hasError && (
        <StyledImage
          src={src}
          alt={alt}
          $objectFit={objectFit}
          $objectPosition={objectPosition}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: 'var(--color-text-secondary)',
          fontSize: '14px',
        }}>
          Failed to load image
        </div>
      )}
    </ImageContainer>
  );
};

// ============================================
// Background Image with Lazy Loading
// ============================================

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: ${props => props.$loaded ? `url(${props.$src})` : 'none'};
  background-size: ${props => props.$size || 'cover'};
  background-position: ${props => props.$position || 'center'};
  background-repeat: no-repeat;
  transition: background-image 0.3s ease;
`;

export const LazyBackground = ({
  src,
  size = 'cover',
  position = 'center',
  children,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [isInView, src]);

  return (
    <BackgroundContainer
      ref={containerRef}
      $src={src}
      $size={size}
      $position={position}
      $loaded={isLoaded}
      {...props}
    >
      {!isLoaded && <Skeleton />}
      {children}
    </BackgroundContainer>
  );
};

// ============================================
// Picture Component with Multiple Sources
// ============================================

export const LazyPicture = ({
  src,
  srcSet,
  sources = [],
  alt = '',
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const pictureRef = useRef(null);

  useEffect(() => {
    if (!pictureRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(pictureRef.current);

    return () => {
      if (pictureRef.current) {
        observer.unobserve(pictureRef.current);
      }
    };
  }, []);

  return (
    <ImageContainer ref={pictureRef} {...props}>
      {!isLoaded && <Skeleton />}
      
      {isInView && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              media={source.media}
              type={source.type}
            />
          ))}
          <StyledImage
            src={src}
            srcSet={srcSet}
            alt={alt}
            $objectFit={objectFit}
            onLoad={() => {
              setIsLoaded(true);
              onLoad?.();
            }}
            onError={onError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
        </picture>
      )}
    </ImageContainer>
  );
};

export default LazyImage;