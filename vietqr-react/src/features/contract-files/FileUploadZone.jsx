import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Upload, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { validatePdfFile } from '../../utils/pdfUtils';
import { useToast } from '../../contexts';

const DropZone = styled(motion.div)`
  border: 2px dashed ${props => props.isDragging ? '#4896de' : props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.lg};
  }
  text-align: center;
  background: ${props =>
    props.isDragging
      ? 'rgba(72, 150, 222, 0.1)'
      : props.theme.colors.surface.default};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4896de;
    background: rgba(72, 150, 222, 0.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary.main};
`;

const UploadText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
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

const FileUploadZone = ({ onFilesUpload, variant = 'dropzone' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();
  const inputRef = React.useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((files) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      toast.error('Vui lòng chọn file PDF');
      return;
    }

    // Validate all files
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
        toast.error(`${name}: ${error}`);
      });
    }

    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
  }, [onFilesUpload, toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    processFiles(files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e) => {
    const { files } = e.target;
    processFiles(files);

    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [processFiles]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#4896de',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload size={18} />
          Tải File Hợp đồng
        </button>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
        />
      </>
    );
  }

  return (
    <>
      <DropZone
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <UploadIcon>
          {isDragging ? <FileUp size={48} /> : <Upload size={48} />}
        </UploadIcon>
        <UploadText>
          {isDragging ? 'Thả file vào đây' : 'Kéo thả file PDF vào đây'}
        </UploadText>
        <UploadHint>hoặc nhấn để chọn file (tối đa 50MB mỗi file)</UploadHint>
      </DropZone>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileSelect}
      />
    </>
  );
};

export default FileUploadZone;
