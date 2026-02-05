/**
 * DL Bonus Calculator - Mobile Layout (Redesigned)
 * Layout: TỔNG THƯỞNG trung tâm, inputs gọn, chi tiết gộp
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, FileText, X, Plus, Trash2, Save, Download } from 'lucide-react';
import styled from 'styled-components';
import { Button } from '../../components';
import {
  Section,
  SectionTitle,
  MainResultCard,
  MainResultLabel,
  MainResultValue,
  DetailCardsRow,
  DetailCard,
  DetailCardLabel,
  DetailCardValue,
  KeyValueGrid,
  KeyValueItem,
  KeyLabel,
  KeyValue,
} from './DLBonusStyles';

// Mobile-specific styles
const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(248, 250, 252, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const MobileTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
`;

const MobileInputGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const MobileInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  min-width: 0;
`;

const MobileInputItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  ${props => props.$fullWidth && `grid-column: 1 / -1;`}
`;

const MobileInputLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MobileInputField = styled.input`
  background: rgba(30, 41, 59, 0.6);
  border: 1.5px solid rgba(248, 250, 252, 0.2);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 12px 10px;
  font-size: 15px;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: rgba(59, 130, 246, 0.6);
    background: rgba(30, 41, 59, 0.8);
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const PopupModal = styled(motion.div)`
  background: rgba(15, 23, 42, 0.98);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 70px;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid rgba(248, 250, 252, 0.1);
`;

const PopupTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  cursor: pointer;
`;

const PopupContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  max-height: calc(80vh - 150px);
`;

const ContractCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ContractCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ContractNumber = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 6px 10px;
  font-size: 12px;
  color: #f87171;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContractFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.sm};
`;

const ContractField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${props => props.$fullWidth && `grid-column: 1 / -1;`}
`;

const ContractFieldLabel = styled.label`
  font-size: 11px;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
`;

const ContractFieldInput = styled.input`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 10px 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  width: 100%;
  box-sizing: border-box;
`;

const ContractFieldSelect = styled.select`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 10px 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  width: 100%;
  box-sizing: border-box;
  
  option {
    background: #1e293b;
  }
`;

const AddContractButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: rgba(59, 130, 246, 0.15);
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: #60a5fa;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  padding: 14px 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const OpenPopupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1.5px solid rgba(59, 130, 246, 0.4);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: #60a5fa;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const ContractCount = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 13px;
`;

// Format number with thousands separator
const formatNumber = (num) => {
  if (num === '-' || num === null || num === undefined || isNaN(num)) return '-';
  return Number(num).toLocaleString('vi-VN');
};

// Parse number from formatted string (vi-VN uses . for thousands)
const parseNumber = (str) => {
  if (!str) return 0;
  // Remove dots (thousand separators in vi-VN) and keep only digits
  return Number(String(str).replace(/\./g, '').replace(/[^0-9-]/g, '')) || 0;
};

const DLBonusMobile = ({
  formData,
  results,
  contracts,
  onFormChange,
  onContractChange,
  onAddContract,
  onDeleteContract,
  onReset,
  onExportExcel
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const validContractCount = contracts.filter(c =>
    c.tenKhachHang || c.soHD || c.khoanVay
  ).length;

  return (
    <>
      <MobileHeader>
        <MobileTitle>💰 Tính Thưởng DL</MobileTitle>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            variant="success"
            icon={<Download size={16} />}
            onClick={onExportExcel}
            size="sm"
          >
            Xuất
          </Button>
          <Button
            variant="ghost"
            icon={<RotateCcw size={16} />}
            onClick={onReset}
            size="sm"
          >
            Làm mới
          </Button>
        </div>
      </MobileHeader>

      <MobileContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Section>
            <SectionTitle>NHẬP THÔNG TIN</SectionTitle>
            <MobileInputGrid>
              <MobileInputRow>
                <MobileInputItem>
                  <MobileInputLabel>TARGET DL</MobileInputLabel>
                  <MobileInputField
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(formData.targetDL)}
                    onChange={(e) => onFormChange('targetDL', parseNumber(e.target.value))}
                    placeholder="0"
                  />
                </MobileInputItem>
                <MobileInputItem>
                  <MobileInputLabel>TARGET ED</MobileInputLabel>
                  <MobileInputField
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(formData.targetED)}
                    onChange={(e) => onFormChange('targetED', parseNumber(e.target.value))}
                    placeholder="0"
                  />
                </MobileInputItem>
              </MobileInputRow>
              <MobileInputRow>
                <MobileInputItem>
                  <MobileInputLabel>PR3 DL (%)</MobileInputLabel>
                  <MobileInputField
                    type="text"
                    inputMode="decimal"
                    value={formData.pr3DL}
                    onChange={(e) => onFormChange('pr3DL', parseFloat(e.target.value) || 0)}
                    placeholder="85"
                  />
                </MobileInputItem>
                <MobileInputItem>
                  <MobileInputLabel>PR6 DL (%)</MobileInputLabel>
                  <MobileInputField
                    type="text"
                    inputMode="decimal"
                    value={formData.pr6DL}
                    onChange={(e) => onFormChange('pr6DL', parseFloat(e.target.value) || 0)}
                    placeholder="90"
                  />
                </MobileInputItem>
              </MobileInputRow>
            </MobileInputGrid>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <Section>
            <SectionTitle>CHI TIẾT HỢP ĐỒNG</SectionTitle>
            <div style={{ padding: '0.75rem' }}>
              <OpenPopupButton onClick={() => setIsPopupOpen(true)}>
                <FileText size={20} />
                Nhập chi tiết hợp đồng
                {validContractCount > 0 && (
                  <ContractCount>{validContractCount} HĐ</ContractCount>
                )}
              </OpenPopupButton>
            </div>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Section>
            <SectionTitle>KẾT QUẢ</SectionTitle>
            <MainResultCard>
              <MainResultLabel>TỔNG THƯỞNG</MainResultLabel>
              <MainResultValue>
                {results.tongIncentive.tongThuong === '-'
                  ? '0 VNĐ'
                  : `${formatNumber(results.tongIncentive.tongThuong)} VNĐ`}
              </MainResultValue>
            </MainResultCard>
            <div style={{ padding: '0.5rem' }}>
              <DetailCardsRow>
                <DetailCard>
                  <DetailCardLabel>Thưởng đạt Target</DetailCardLabel>
                  <DetailCardValue>{results.tongIncentive.thuongDatTarget}</DetailCardValue>
                </DetailCard>
                <DetailCard>
                  <DetailCardLabel>Thưởng DS/Risk</DetailCardLabel>
                  <DetailCardValue>{results.tongIncentive.thuongDSTheoHSRisk}</DetailCardValue>
                </DetailCard>
                <DetailCard>
                  <DetailCardLabel>Thưởng Bảo Hiểm</DetailCardLabel>
                  <DetailCardValue>{results.tongIncentive.thuongBaoHiem}</DetailCardValue>
                </DetailCard>
              </DetailCardsRow>
            </div>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <Section>
            <SectionTitle>CHI TIẾT: (A+B)×C+D</SectionTitle>
            <div style={{ padding: '0.5rem' }}>
              <KeyValueGrid>
                <KeyValueItem>
                  <KeyLabel>A: DS × HS Pr</KeyLabel>
                  <KeyValue style={{ color: '#60a5fa' }}>{formatNumber(results.details?.A || 0)}</KeyValue>
                </KeyValueItem>
                <KeyValueItem>
                  <KeyLabel>B: CT × HS vượt</KeyLabel>
                  <KeyValue style={{ color: '#34d399' }}>{formatNumber(results.details?.B || 0)}</KeyValue>
                </KeyValueItem>
                <KeyValueItem>
                  <KeyLabel>C: HS ngành hàng</KeyLabel>
                  <KeyValue style={{ color: '#fbbf24' }}>{results.details?.C || 0}</KeyValue>
                </KeyValueItem>
                <KeyValueItem>
                  <KeyLabel>D: Thưởng BH</KeyLabel>
                  <KeyValue style={{ color: '#f472b6' }}>{formatNumber(results.details?.D || 0)}</KeyValue>
                </KeyValueItem>
              </KeyValueGrid>
            </div>
          </Section>
        </motion.div>
      </MobileContainer >

      <AnimatePresence>
        {isPopupOpen && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPopupOpen(false)}
          >
            <PopupModal
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PopupHeader>
                <PopupTitle>📋 Chi tiết hợp đồng</PopupTitle>
                <CloseButton onClick={() => setIsPopupOpen(false)}>
                  <X size={18} />
                </CloseButton>
              </PopupHeader>

              <PopupContent>
                {contracts.map((contract, index) => (
                  <ContractCard key={contract.id}>
                    <ContractCardHeader>
                      <ContractNumber>Hợp đồng #{index + 1}</ContractNumber>
                      <DeleteButton onClick={() => onDeleteContract(contract.id)}>
                        <Trash2 size={12} />
                        Xóa
                      </DeleteButton>
                    </ContractCardHeader>

                    <ContractFieldsGrid>
                      <ContractField>
                        <ContractFieldLabel>Kỳ hạn</ContractFieldLabel>
                        <ContractFieldSelect
                          value={contract.kyHan}
                          onChange={(e) => onContractChange(contract.id, 'kyHan', e.target.value)}
                        >
                          <option value="">-- Chọn --</option>
                          <option value="6">6 tháng</option>
                          <option value="9">9 tháng</option>
                          <option value="12">12 tháng</option>
                          <option value="15">15 tháng</option>
                          <option value="18">18 tháng</option>
                          <option value="24">24 tháng</option>
                        </ContractFieldSelect>
                      </ContractField>
                      <ContractField>
                        <ContractFieldLabel>Khoản vay</ContractFieldLabel>
                        <ContractFieldInput
                          type="text"
                          inputMode="numeric"
                          value={formatNumber(contract.khoanVay)}
                          onChange={(e) => onContractChange(contract.id, 'khoanVay', parseNumber(e.target.value))}
                          placeholder="50.000.000"
                        />
                      </ContractField>
                      <ContractField>
                        <ContractFieldLabel>Bảo hiểm</ContractFieldLabel>
                        <ContractFieldSelect
                          value={contract.baoHiem}
                          onChange={(e) => onContractChange(contract.id, 'baoHiem', e.target.value)}
                        >
                          <option value="N">Không (N)</option>
                          <option value="Y">Có (Y)</option>
                        </ContractFieldSelect>
                      </ContractField>
                      <ContractField>
                        <ContractFieldLabel>Điểm Scheme</ContractFieldLabel>
                        <ContractFieldSelect
                          value={contract.diemScheme}
                          onChange={(e) => onContractChange(contract.id, 'diemScheme', e.target.value)}
                        >
                          <option value="">-- Chọn --</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </ContractFieldSelect>
                      </ContractField>
                      <ContractField $fullWidth>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '8px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.6)' }}>BH: <strong style={{ color: '#f472b6' }}>{formatNumber(contract.calculatedInsurance)}</strong></span>
                          <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.6)' }}>DS: <strong style={{ color: '#60a5fa' }}>{formatNumber(contract.calculatedDS)}</strong></span>
                          <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.6)' }}>HS: <strong style={{ color: '#fbbf24' }}>{contract.calculatedHeSo || '-'}%</strong></span>
                        </div>
                      </ContractField>
                    </ContractFieldsGrid>
                  </ContractCard>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <AddContractButton onClick={onAddContract} style={{ flex: 1 }}>
                    <Plus size={18} />
                    Thêm HĐ
                  </AddContractButton>
                  <SaveButton onClick={() => setIsPopupOpen(false)}>
                    <Save size={18} />
                    Lưu
                  </SaveButton>
                </div>
              </PopupContent>
            </PopupModal>
          </PopupOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default DLBonusMobile;
