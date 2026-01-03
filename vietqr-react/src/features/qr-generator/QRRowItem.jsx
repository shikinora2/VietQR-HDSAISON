import React, { useState, useEffect, useRef } from 'react';
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
    padding: 16px;
    margin-bottom: 8px;
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: stretch;
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 12px;
  }
`;

const RowLine = styled.div`
  display: flex;
  flex: 1;
  gap: ${props => props.theme.spacing.md};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 6px;
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
  font-size: 12px;
  color: rgba(248, 250, 252, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 4px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; /* Hide on desktop - show header row instead */
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid rgba(100, 116, 139, 0.5);
  border-radius: 12px;
  font-size: ${props => props.theme.typography.fontSize.base};
  background: rgba(30, 41, 59, 0.8);
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.main}20;
  }

  &::placeholder {
    color: rgba(148, 163, 184, 0.7);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 50px;
    font-size: 16px;
    padding: 12px 16px;
    border-radius: 8px;
  }
`;

const ErrorMsg = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.error.main};
  min-height: 16px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const QRDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  min-width: 180px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
    padding-top: 10px;
    border-top: 1px solid ${props => props.theme.colors.border.light};
    margin-top: 4px;
    /* Hide if empty on mobile */
    &:empty { display: none; }
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const QRActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
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
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all 0.2s;
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  min-height: 40px;

  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }

  &.primary {
    background: ${props => props.theme.colors.surface.default};
    color: ${props => props.theme.colors.text.secondary};
  }

  &.danger {
    background: ${props => props.theme.colors.surface.default};
    color: ${props => props.theme.colors.text.secondary};
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

  // Use ref to store callback to avoid dependency issues
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  // Debounce form data
  const debouncedFormData = useDebounce(formData, 500);

  // Track if initial data has been set to avoid triggering update on mount
  const isInitialMountRef = useRef(true);

  // Sync props to state when row data changes externally
  useEffect(() => {
    setFormData(prev => {
      if (
        prev.contractNumber !== (row.contractNumber || '') ||
        prev.customerName !== (row.customerName || '') ||
        prev.amount !== (row.amount || '')
      ) {
        return {
          contractNumber: row.contractNumber || '',
          customerName: row.customerName || '',
          amount: row.amount || '',
        };
      }
      return prev;
    });
  }, [row.contractNumber, row.customerName, row.amount]);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (debouncedFormData.contractNumber || debouncedFormData.customerName || debouncedFormData.amount) {
      onUpdateRef.current(debouncedFormData);
    }
  }, [debouncedFormData.contractNumber, debouncedFormData.customerName, debouncedFormData.amount]);

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

  const isComplete = formData.contractNumber && formData.amount;
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
            value={formData.amount ? formatCurrency(formData.amount, false) : ''}
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
          <QRPlaceholder>
            <QrCode size={24} />
          </QRPlaceholder>
        )}
      </QRDisplay>
    </RowContainer>
  );
};

export default QRRowItem;
