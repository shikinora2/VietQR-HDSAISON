import React from 'react';
import styled from 'styled-components';
import { Plus, FileText, QrCode, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/formatUtils';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const TopButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
`;

const TopButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  min-height: 40px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface.default};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg.input};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: #4896de;
    box-shadow: 0 0 0 2px rgba(72, 150, 222, 0.2);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const GenerateButton = styled(ActionButton)`
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.border.default};

  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }
`;

const DeleteButton = styled(ActionButton)`
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.border.default};

  &:hover {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

/**
 * Mobile Layout cho QRGenerator Tab
 * Redesigned theo ảnh mẫu
 */
const QRGeneratorMobile = ({
  qrRows,
  selectedBank,
  bankAccounts,
  isProcessing,
  fileInputRef,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onDuplicateRow,
  onViewQR,
  onBankChange,
  onFileUpload,
}) => {
  return (
    <Container>
      {/* Top Buttons Row */}
      <TopButtonRow>
        <TopButton onClick={() => fileInputRef.current?.click()}>
          <FileText />
          Tải File
        </TopButton>
        <TopButton onClick={onAddRow}>
          <Plus />
          Thêm dòng
        </TopButton>
      </TopButtonRow>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        multiple
        onChange={onFileUpload}
      />

      {/* Form Cards */}
      <AnimatePresence mode="popLayout">
        {qrRows.map((row, index) => (
          <FormCard
            key={row.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <InputGroup>
              <Label>SỐ HỢP ĐỒNG</Label>
              <StyledInput
                type="text"
                placeholder="Số hợp đồng"
                value={row.contractNumber || ''}
                onChange={(e) => onUpdateRow(row.id, { contractNumber: e.target.value })}
              />
            </InputGroup>

            <InputGroup>
              <Label>HỌ TÊN</Label>
              <StyledInput
                type="text"
                placeholder="Họ tên (không bắt buộc)"
                value={row.customerName || ''}
                onChange={(e) => onUpdateRow(row.id, { customerName: e.target.value })}
              />
            </InputGroup>

            <InputGroup>
              <Label>SỐ TIỀN (VND)</Label>
              <StyledInput
                type="text"
                placeholder="Số tiền (VND)"
                value={row.amount ? formatCurrency(row.amount, false) : ''}
                onChange={(e) => {
                  const numericValue = Number(e.target.value.replace(/\D/g, ''));
                  onUpdateRow(row.id, { amount: numericValue });
                }}
              />
            </InputGroup>

            <ButtonRow>
              <GenerateButton onClick={() => onViewQR(row)}>
                <QrCode />
                Tạo mã
              </GenerateButton>
              <DeleteButton onClick={() => onDeleteRow(row.id)}>
                <Trash2 />
                Xóa
              </DeleteButton>
            </ButtonRow>
          </FormCard>
        ))}
      </AnimatePresence>
    </Container>
  );
};

export default QRGeneratorMobile;
