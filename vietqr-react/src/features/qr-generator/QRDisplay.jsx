import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import useQRGenerator from '../../hooks/useQRGenerator';

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 300px;
  margin: 0 auto;
`;

const QRImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
  padding: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: scale(1.02);
  }
`;

const LoadingPlaceholder = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.secondary};
`;

const ZoomOverlay = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  pointer-events: none;
  opacity: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const Wrapper = styled.div`
  position: relative;

  &:hover ${ZoomOverlay} {
    opacity: 1;
  }
`;

const ErrorMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.status.error}20;
  color: ${props => props.theme.colors.status.error};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const QRDisplay = ({ contract, onImageClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { generateContractQRCode } = useQRGenerator();

  let qrUrl = '';
  try {
    qrUrl = generateContractQRCode(contract);
  } catch (error) {
    console.error('Error generating QR URL:', error);
    return <ErrorMessage>Lỗi tạo mã QR</ErrorMessage>;
  }

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return <ErrorMessage>Không thể tải mã QR</ErrorMessage>;
  }

  return (
    <Container>
      <Wrapper>
        {isLoading && (
          <LoadingPlaceholder
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Đang tải...
          </LoadingPlaceholder>
        )}
        
        <QRImage
          src={qrUrl}
          alt="QR Code"
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={onImageClick}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        />

        <ZoomOverlay>
          <ZoomIn size={16} />
          <span>Xem phóng to</span>
        </ZoomOverlay>
      </Wrapper>
    </Container>
  );
};

export default QRDisplay;
