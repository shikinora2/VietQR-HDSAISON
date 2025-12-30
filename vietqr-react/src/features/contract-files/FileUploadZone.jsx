import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Upload, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { validatePdfFile } from '../../utils/pdfUtils';
import { useToast } from '../../contexts';

const DropZone = styled(motion.div)`
  border: 2px dashed ${props => props.isDragging ? props.theme.colors.primary.main : props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
  background: ${props =>
    props.isDragging
      ? `${props.theme.colors.primary.main}10`
      : props.theme.colors.background.paper};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    background: ${props => props.theme.colors.primary.main}05;
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

const FileUploadZone = ({ onFilesUpload }) => {
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
