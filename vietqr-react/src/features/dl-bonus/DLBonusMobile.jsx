/**
 * DL Bonus Calculator - Mobile Layout (Redesigned)
 * Layout: TỔNG THƯỞNG trung tâm, inputs gọn, chi tiết gộp
 */

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
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
    InputGrid,
    InputItem,
    InputLabel,
    InputField,
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

// Format number with thousands separator
const formatNumber = (num) => {
    if (num === '-' || num === null || num === undefined) return '-';
    return Number(num).toLocaleString('vi-VN');
};

// Parse number from formatted string
const parseNumber = (str) => {
    if (!str) return 0;
    return Number(String(str).replace(/[^0-9.-]/g, '')) || 0;
};

const DLBonusMobile = ({ formData, results, onFormChange, onReset }) => {
    return (
        <>
            {/* Header */}
            <MobileHeader>
                <MobileTitle>💰 Tính Thưởng DL</MobileTitle>
                <Button
                    variant="ghost"
                    icon={<RotateCcw size={16} />}
                    onClick={onReset}
                    size="sm"
                >
                    Làm mới
                </Button>
            </MobileHeader>

            <MobileContainer>
                {/* Section 1: NHẬP THÔNG TIN */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Section>
                        <SectionTitle>NHẬP THÔNG TIN</SectionTitle>
                        <div style={{ padding: '0.5rem' }}>
                            <InputGrid>
                                <InputItem>
                                    <InputLabel>TARGET DL</InputLabel>
                                    <InputField
                                        type="text"
                                        inputMode="numeric"
                                        value={formatNumber(formData.targetDL)}
                                        onChange={(e) => onFormChange('targetDL', parseNumber(e.target.value))}
                                        placeholder="0"
                                    />
                                </InputItem>
                                <InputItem>
                                    <InputLabel>TARGET ED</InputLabel>
                                    <InputField
                                        type="text"
                                        inputMode="numeric"
                                        value={formatNumber(formData.targetED)}
                                        onChange={(e) => onFormChange('targetED', parseNumber(e.target.value))}
                                        placeholder="0"
                                    />
                                </InputItem>
                                <InputItem>
                                    <InputLabel>DOANH SỐ ED</InputLabel>
                                    <InputField
                                        type="text"
                                        inputMode="numeric"
                                        value={formatNumber(formData.doanhSoED)}
                                        onChange={(e) => onFormChange('doanhSoED', parseNumber(e.target.value))}
                                        placeholder="0"
                                    />
                                </InputItem>
                                <InputItem>
                                    <InputLabel>PR3 DL</InputLabel>
                                    <InputField
                                        type="text"
                                        inputMode="decimal"
                                        value={formData.pr3DL}
                                        onChange={(e) => onFormChange('pr3DL', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </InputItem>
                                <InputItem>
                                    <InputLabel>PR6 DL</InputLabel>
                                    <InputField
                                        type="text"
                                        inputMode="decimal"
                                        value={formData.pr6DL}
                                        onChange={(e) => onFormChange('pr6DL', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </InputItem>
                            </InputGrid>
                        </div>
                    </Section>
                </motion.div>

                {/* Section 2: KẾT QUẢ */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                >
                    <Section>
                        <SectionTitle>KẾT QUẢ</SectionTitle>

                        {/* Main Result - TỔNG THƯỞNG */}
                        <MainResultCard>
                            <MainResultLabel>TỔNG THƯỞNG</MainResultLabel>
                            <MainResultValue>
                                {results.tongIncentive.tongThuong === '-'
                                    ? '0 VNĐ'
                                    : `${formatNumber(results.tongIncentive.tongThuong)} VNĐ`}
                            </MainResultValue>
                        </MainResultCard>

                        {/* Detail Cards */}
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

                {/* Section 3: CHI TIẾT */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                >
                    <Section>
                        <SectionTitle>CHI TIẾT TÍNH TOÁN</SectionTitle>
                        <div style={{ padding: '0.5rem' }}>
                            <KeyValueGrid>
                                <KeyValueItem>
                                    <KeyLabel>Hệ số đạt chỉ tiêu</KeyLabel>
                                    <KeyValue>{results.heSoDatChiTieu}</KeyValue>
                                </KeyValueItem>
                                <KeyValueItem>
                                    <KeyLabel>Mức thưởng</KeyLabel>
                                    <KeyValue>{formatNumber(results.thuongDatChiTieu.mucThuong)}</KeyValue>
                                </KeyValueItem>
                                <KeyValueItem>
                                    <KeyLabel>% Giải ngân</KeyLabel>
                                    <KeyValue>{results.thuongDatChiTieu.phanTramGiaiNgan}</KeyValue>
                                </KeyValueItem>
                                <KeyValueItem>
                                    <KeyLabel>Hệ số Risk</KeyLabel>
                                    <KeyValue>{results.thuongDoanhSoRisk.heSoRisk}</KeyValue>
                                </KeyValueItem>
                            </KeyValueGrid>
                        </div>
                    </Section>
                </motion.div>
            </MobileContainer>
        </>
    );
};

export default DLBonusMobile;
