import React, { useRef } from 'react';
import styled from 'styled-components';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Button } from '../../components';
import { validatePdfFile } from '../../utils/pdfUtils';
import { useToast } from '../../contexts';

const UploadCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const UploadArea = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  border: 2px dashed ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    background: ${props => props.theme.colors.primary.main}05;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary.main}20;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary.main};
  flex-shrink: 0;
`;

const UploadContent = styled.div`
  flex: 1;
`;

const UploadTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const UploadHint = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadPDFExtract = ({ onUpload }) => {
  const inputRef = useRef(null);
  const { showToast } = useToast();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate files
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      showToast('Vui lòng chọn file PDF', 'error');
      return;
    }

    const invalidFiles = [];
    const validFiles = pdfFiles.filter(file => {
      const validation = validatePdfFile(file);
      if (!validation.valid) {
        invalidFiles.push({ name: file.name, error: validation.error });
        return false;
      }
      return true;
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ name, error }) => {
        showToast(`${name}: ${error}`, 'error');
      });
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <UploadCard variant="elevated">
      <UploadArea
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <UploadIcon>
          <FileText size={24} />
        </UploadIcon>
        
        <UploadContent>
          <UploadTitle>Tải lên PDF để trích xuất dữ liệu</UploadTitle>
          <UploadHint>
            Nhấn để chọn file PDF hợp đồng (có thể chọn nhiều file)
          </UploadHint>
        </UploadContent>

        <Button variant="primary" icon={<Upload size={18} />}>
          Chọn File
        </Button>
      </UploadArea>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileSelect}
      />
    </UploadCard>
  );
};

export default UploadPDFExtract;
