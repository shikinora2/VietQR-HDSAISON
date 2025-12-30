import React, { useState } from 'react';
import styled from 'styled-components';
import { Printer, X } from 'lucide-react';
import { Modal, Button } from '../../components';
import { useToast } from '../../contexts';

const DialogContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary.main}10;
  }

  input:checked + & {
    background: ${props => props.theme.colors.primary.main}20;
    border: 1px solid ${props => props.theme.colors.primary.main};
  }
`;

const RadioInput = styled.input`
  accent-color: ${props => props.theme.colors.primary.main};
  cursor: pointer;
`;

const OptionLabel = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const OptionDesc = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const FileList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const FileItem = styled.div`
  padding: ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
`;

const PrintDialog = ({ files, onClose }) => {
  const [printMode, setPrintMode] = useState('front');
  const { showToast } = useToast();

  const handlePrint = () => {
    try {
      // Create print content
      const printWindow = window.open('', '_blank');
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>In Hợp Đồng</title>
            <style>
              body {
                font-family: 'IBM Plex Sans', sans-serif;
                padding: 20px;
              }
              .page {
                page-break-after: always;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
              }
              .contract-info {
                margin: 20px 0;
              }
              .info-row {
                display: flex;
                margin: 10px 0;
              }
              .label {
                font-weight: bold;
                width: 150px;
              }
              @media print {
                .page {
                  page-break-after: always;
                }
              }
            </style>
          </head>
          <body>
      `;

      files.forEach((file, index) => {
        const pageClass = index < files.length - 1 ? 'page' : '';
        
        htmlContent += `
          <div class="${pageClass}">
            <div class="header">
              <h1>HỢP ĐỒNG</h1>
              <p>${printMode === 'front' ? 'MẶT TRƯỚC' : 'MẶT SAU'}</p>
            </div>
            <div class="contract-info">
              <div class="info-row">
                <span class="label">Số hợp đồng:</span>
                <span>${file.contractNumber || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Khách hàng:</span>
                <span>${file.customerName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Tên hãng:</span>
                <span>${file.brandName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">File:</span>
                <span>${file.fileName}</span>
              </div>
            </div>
          </div>
        `;
      });

      htmlContent += `
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      showToast('Đang mở cửa sổ in...', 'info');
      onClose();
    } catch (error) {
      showToast('Lỗi khi in: ' + error.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Tùy Chọn In"
      size="medium"
    >
      <DialogContent>
        <Section>
          <SectionTitle>Chế độ in</SectionTitle>
          <OptionGroup>
            <RadioOption>
              <RadioInput
                type="radio"
                name="printMode"
                value="front"
                checked={printMode === 'front'}
                onChange={() => setPrintMode('front')}
              />
              <OptionLabel>
                <OptionTitle>In Mặt Trước</OptionTitle>
                <OptionDesc>In thông tin hợp đồng mặt trước</OptionDesc>
              </OptionLabel>
            </RadioOption>

            <RadioOption>
              <RadioInput
                type="radio"
                name="printMode"
                value="back"
                checked={printMode === 'back'}
                onChange={() => setPrintMode('back')}
              />
              <OptionLabel>
                <OptionTitle>In Mặt Sau</OptionTitle>
                <OptionDesc>In thông tin hợp đồng mặt sau</OptionDesc>
              </OptionLabel>
            </RadioOption>

            <RadioOption>
              <RadioInput
                type="radio"
                name="printMode"
                value="both"
                checked={printMode === 'both'}
                onChange={() => setPrintMode('both')}
              />
              <OptionLabel>
                <OptionTitle>In Cả Hai Mặt</OptionTitle>
                <OptionDesc>In cả mặt trước và mặt sau</OptionDesc>
              </OptionLabel>
            </RadioOption>
          </OptionGroup>
        </Section>

        <Section>
          <SectionTitle>Danh sách file ({files.length})</SectionTitle>
          <FileList>
            {files.map((file, index) => (
              <FileItem key={file.id}>
                {index + 1}. {file.fileName}
                {file.brandName && ` - ${file.brandName}`}
              </FileItem>
            ))}
          </FileList>
        </Section>

        <Actions>
          <Button variant="ghost" icon={<X size={18} />} onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" icon={<Printer size={18} />} onClick={handlePrint}>
            In Ngay
          </Button>
        </Actions>
      </DialogContent>
    </Modal>
  );
};

export default PrintDialog;
