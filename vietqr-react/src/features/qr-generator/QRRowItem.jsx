import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2, Download, Printer, Share2, QrCode } from 'lucide-react';
import useQRGenerator from '../../hooks/useQRGenerator';
import useDebounce from '../../hooks/useDebounce';
import { formatCurrency } from '../../utils/formatUtils';

// Inline Row Layout matching HTML legacy
const RowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.light};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: ${props => props.theme.shadows.sm};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const RowLine = styled.div`
  display: flex;
  flex: 1;
  gap: ${props => props.theme.spacing.md};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const FieldWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    &:nth-child(1) { flex: 0 0 220px; }
    &:nth-child(2) { flex: 0 0 250px; }
    &:nth-child(3) { flex: 0 0 160px; }
  }
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${props => props.theme.typography.fontWeight.medium};

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; /* Hide on desktop - show header row instead */
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background: ${props => props.theme.colors.bg.input};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.main}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const ErrorMsg = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.error.main};
  min-height: 16px;
`;

const QRDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  min-width: 180px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
    padding-top: ${props => props.theme.spacing.md};
    border-top: 1px solid ${props => props.theme.colors.border.light};
  }
`;

const QRThumb = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  cursor: pointer;
  transition: transform 0.2s;
  background: white;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const QRPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px dashed ${props => props.theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.tertiary};
`;

const QRActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.surface.elevated};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary.main};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: ${props => props.theme.colors.error.main};
    color: white;
  }
`;

// Mobile action buttons
const MobileRowActions = styled.div`
  display: none;
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    width: 100%;
  }
`;

const MobileActionBtn = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all 0.2s;

  &.primary {
    background: ${props => props.theme.colors.primary.main};
    color: white;
  }

  &.danger {
    background: ${props => props.theme.colors.error.light};
    color: ${props => props.theme.colors.error.main};
  }
`;

const QRRowItem = ({ row, index, onUpdate, onDelete, onDuplicate, onViewQR }) => {
  const [formData, setFormData] = useState({
    contractNumber: row.contractNumber || '',
    customerName: row.customerName || '',
    amount: row.amount || '',
  });

  const [errors, setErrors] = useState({});
  const { generateContractQRCode, downloadQR } = useQRGenerator();

  // Debounce form data
  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    if (debouncedFormData.contractNumber || debouncedFormData.customerName) {
      onUpdate(debouncedFormData);
    }
  }, [debouncedFormData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, amount: numericValue }));
  };

  const isComplete = formData.contractNumber && formData.customerName && formData.amount;
  const qrUrl = isComplete ? generateContractQRCode(formData) : null;

  const handleDownload = async () => {
    if (!isComplete) return;
    try {
      await downloadQR(qrUrl, `QR_${formData.contractNumber}.png`);
    } catch (error) {
      console.error('Error downloading QR:', error);
    }
  };

  const handlePrint = () => {
    if (!isComplete) return;
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>In QR - ${formData.contractNumber}</title>
          <style>
            body { 
              font-family: sans-serif; 
              text-align: center; 
              padding: 40px; 
            }
            img { width: 300px; height: 300px; }
            .info { margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <img src="${qrUrl}" alt="QR Code" />
          <div class="info">
            <div><strong>Hợp đồng:</strong> ${formData.contractNumber}</div>
            <div><strong>Khách hàng:</strong> ${formData.customerName}</div>
            <div><strong>Số tiền:</strong> ${formatCurrency(formData.amount)} VNĐ</div>
          </div>
          <script>
            window.onload = () => { 
              setTimeout(() => { window.print(); window.close(); }, 500); 
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (!isComplete) return;
    const shareUrl = `${window.location.origin}?c=${formData.contractNumber}&n=${encodeURIComponent(formData.customerName)}&a=${formData.amount}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      // Show toast here if needed
    } catch (error) {
      console.error('Error copying share link:', error);
    }
  };

  return (
    <RowContainer>
      <RowLine>
        <FieldWrapper>
          <Label>Số hợp đồng</Label>
          <Input
            placeholder="Số hợp đồng"
            value={formData.contractNumber}
            onChange={(e) => handleChange('contractNumber', e.target.value)}
          />
          <ErrorMsg>{errors.contractNumber || ''}</ErrorMsg>
        </FieldWrapper>

        <FieldWrapper>
          <Label>Họ tên</Label>
          <Input
            placeholder="Họ tên (không bắt buộc)"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
          />
          <ErrorMsg>{errors.customerName || ''}</ErrorMsg>
        </FieldWrapper>

        <FieldWrapper>
          <Label>Số tiền (VND)</Label>
          <Input
            placeholder="Số tiền (VND)"
            inputMode="numeric"
            value={formData.amount ? formatCurrency(formData.amount) : ''}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <ErrorMsg>{errors.amount || ''}</ErrorMsg>
        </FieldWrapper>
      </RowLine>

      {/* Mobile action buttons */}
      <MobileRowActions>
        <MobileActionBtn
          className="primary"
          onClick={onViewQR}
          disabled={!isComplete}
        >
          <QrCode size={16} /> Tạo mã
        </MobileActionBtn>
        <MobileActionBtn
          className="danger"
          onClick={onDelete}
        >
          <Trash2 size={16} /> Xóa
        </MobileActionBtn>
      </MobileRowActions>

      {/* QR Display - Desktop */}
      <QRDisplay>
        {qrUrl ? (
          <>
            <QRThumb
              src={qrUrl}
              alt="QR preview"
              onClick={onViewQR}
              title="Click để phóng to"
            />
            <QRActions>
              <ActionButton onClick={handlePrint} title="In QR">
                <Printer size={16} />
              </ActionButton>
              <ActionButton onClick={handleDownload} title="Tải xuống">
                <Download size={16} />
              </ActionButton>
              <ActionButton onClick={handleShare} title="Chia sẻ">
                <Share2 size={16} />
              </ActionButton>
              <DeleteButton onClick={onDelete} title="Xóa">
                <Trash2 size={16} />
              </DeleteButton>
            </QRActions>
          </>
        ) : (
          <>
            <QRPlaceholder>
              <QrCode size={24} />
            </QRPlaceholder>
            <DeleteButton onClick={onDelete} title="Xóa">
              <Trash2 size={16} />
            </DeleteButton>
          </>
        )}
      </QRDisplay>
    </RowContainer>
  );
};

export default QRRowItem;
