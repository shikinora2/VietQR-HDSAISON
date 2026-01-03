import React from 'react';
import styled from 'styled-components';
import { Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/atoms';
import QRRowItem from './QRRowItem';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  flex-wrap: wrap;
`;

const QRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
`;

const HeaderColumn = styled.div`
  flex: 0 0 220px;

  &:nth-child(2) { flex: 0 0 250px; }
  &:nth-child(3) { flex: 0 0 160px; }
  &:last-child { 
    flex: 1;
    text-align: center;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px dashed ${props => props.theme.colors.border.default};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.md};
  opacity: 0.3;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const BankSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const BankLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  white-space: nowrap;
`;

const BankSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bg.input};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  min-width: 280px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.main}20;
  }
`;

const BankInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;

  span {
    display: flex;
    gap: ${props => props.theme.spacing.xs};
  }

  strong {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const AddButton = styled(Button)`
  background: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.border.default};
  font-weight: 500;
  min-height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.surface.hover};
    border-color: ${props => props.theme.colors.border.light};
  }
`;

/**
 * Desktop Layout cho QRGenerator Tab
 * Full header, bank selector, và table-like row display
 */
const QRGeneratorDesktop = ({
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
      <Header>
        <Title>🏦 Tạo Mã QR Chuyển Khoản</Title>
        <Actions>
          <AddButton
            icon={<Plus size={18} />}
            onClick={onAddRow}
          >
            Thêm Hàng
          </AddButton>
          <AddButton
            icon={<Download size={18} />}
            onClick={() => fileInputRef.current?.click()}
            loading={isProcessing}
          >
            Tải File Hợp Đồng
          </AddButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="application/pdf"
            multiple
            onChange={onFileUpload}
          />
        </Actions>
      </Header>

      {/* Bank Account Selector */}
      <BankSelectorWrapper>
        <BankLabel>💳 Tài khoản nhận tiền:</BankLabel>
        <BankSelect
          value={selectedBank.id}
          onChange={(e) => {
            const bank = bankAccounts.find(b => b.id === e.target.value);
            if (bank) onBankChange(bank);
          }}
        >
          {bankAccounts.map(bank => (
            <option key={bank.id} value={bank.id}>
              {bank.bankName} - {bank.accountNumber}
            </option>
          ))}
        </BankSelect>
        <BankInfo>
          <span>STK: <strong>{selectedBank.accountNumber}</strong></span>
          <span>Tên: <strong>{selectedBank.accountName}</strong></span>
        </BankInfo>
      </BankSelectorWrapper>

      {qrRows.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyIcon>📱</EmptyIcon>
          <EmptyText>Chưa có dữ liệu. Nhấn "Thêm Hàng" hoặc "Tải File" để bắt đầu.</EmptyText>
          <Actions style={{ justifyContent: 'center' }}>
            <AddButton icon={<Plus size={18} />} onClick={onAddRow}>
              Thêm Hàng Đầu Tiên
            </AddButton>
            <AddButton
              icon={<Download size={18} />}
              onClick={() => fileInputRef.current?.click()}
            >
              Tải File Hợp Đồng
            </AddButton>
          </Actions>
        </EmptyState>
      ) : (
        <QRList>
          <AnimatePresence mode="popLayout">
            {qrRows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <QRRowItem
                  row={row}
                  index={index}
                  onUpdate={(data) => onUpdateRow(row.id, data)}
                  onDelete={() => onDeleteRow(row.id)}
                  onDuplicate={() => onDuplicateRow(row)}
                  onViewQR={() => onViewQR(row)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </QRList>
      )}
    </Container>
  );
};

export default QRGeneratorDesktop;
