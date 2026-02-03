/**
 * DL Bonus Calculator - Desktop Layout (Redesigned)
 * Layout: TỔNG THƯỞNG trung tâm, inputs gọn, chi tiết gộp
 */

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components';
import {
    Container,
    Header,
    Title,
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
    ContractsTableWrapper,
    ContractsTable,
    ContractsTh,
    ContractsTd,
    ContractInput,
    ContractSelect,
    ContractResultCell,
    TableActions,
    AddRowButton,
    DeleteRowButton,
    SectionHeader,
} from './DLBonusStyles';

// Format number with thousands separator
const formatNumber = (num) => {
    if (num === '-' || num === null || num === undefined || num === '') return '-';
    return Number(num).toLocaleString('vi-VN');
};

// Parse number from formatted string
const parseNumber = (str) => {
    if (!str) return 0;
    return Number(String(str).replace(/[^0-9.-]/g, '')) || 0;
};

const DLBonusDesktop = ({
    formData,
    results,
    contracts,
    onFormChange,
    onContractChange,
    onAddContract,
    onDeleteContract,
    onReset
}) => {
    return (
        <Container style={{ maxWidth: '1200px' }}>
            {/* Header */}
            <Header>
                <Title>💰 Tính Thưởng DL</Title>
                <Button
                    variant="ghost"
                    icon={<RotateCcw size={18} />}
                    onClick={onReset}
                >
                    Làm mới
                </Button>
            </Header>

            {/* Section 1: NHẬP THÔNG TIN - Layout grid gọn */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Section>
                    <SectionTitle>NHẬP THÔNG TIN</SectionTitle>
                    <div style={{ padding: '0.5rem' }}>
                        <InputGrid>
                            <InputItem>
                                <InputLabel>TARGET DL</InputLabel>
                                <InputField
                                    type="text"
                                    value={formatNumber(formData.targetDL)}
                                    onChange={(e) => onFormChange('targetDL', parseNumber(e.target.value))}
                                    placeholder="0"
                                />
                            </InputItem>
                            <InputItem>
                                <InputLabel>TARGET ED</InputLabel>
                                <InputField
                                    type="text"
                                    value={formatNumber(formData.targetED)}
                                    onChange={(e) => onFormChange('targetED', parseNumber(e.target.value))}
                                    placeholder="0"
                                />
                            </InputItem>
                            <InputItem>
                                <InputLabel>DOANH SỐ ED</InputLabel>
                                <InputField
                                    type="text"
                                    value={formatNumber(formData.doanhSoED)}
                                    onChange={(e) => onFormChange('doanhSoED', parseNumber(e.target.value))}
                                    placeholder="0"
                                />
                            </InputItem>
                            <InputItem>
                                <InputLabel>PR3 DL</InputLabel>
                                <InputField
                                    type="text"
                                    value={formData.pr3DL}
                                    onChange={(e) => onFormChange('pr3DL', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                />
                            </InputItem>
                            <InputItem>
                                <InputLabel>PR6 DL</InputLabel>
                                <InputField
                                    type="text"
                                    value={formData.pr6DL}
                                    onChange={(e) => onFormChange('pr6DL', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                />
                            </InputItem>
                        </InputGrid>
                    </div>
                </Section>
            </motion.div>

            {/* Section 2: CHI TIẾT HỢP ĐỒNG - Editable Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Section>
                    <SectionHeader>
                        <SectionTitle>CHI TIẾT HỢP ĐỒNG</SectionTitle>
                        <AddRowButton onClick={onAddContract}>
                            <Plus size={14} />
                            Thêm dòng
                        </AddRowButton>
                    </SectionHeader>

                    <ContractsTableWrapper>
                        <ContractsTable>
                            <thead>
                                <tr>
                                    <ContractsTh style={{ width: '30px' }}>#</ContractsTh>
                                    <ContractsTh style={{ width: '70px' }}>KỲ HẠN</ContractsTh>
                                    <ContractsTh style={{ width: '120px' }}>KHOẢN VAY</ContractsTh>
                                    <ContractsTh style={{ width: '70px' }}>BẢO HIỂM<br />(Có=Y)</ContractsTh>
                                    <ContractsTh style={{ width: '100px' }}>MÃ SCHEME</ContractsTh>
                                    <ContractsTh style={{ width: '100px' }} $highlight>BẢO HIỂM</ContractsTh>
                                    <ContractsTh style={{ width: '120px' }} $highlight>THƯỞNG DS</ContractsTh>
                                    <ContractsTh style={{ width: '80px' }} $highlight>HỆ SỐ (%)</ContractsTh>
                                    <ContractsTh style={{ width: '40px' }}></ContractsTh>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map((contract, index) => (
                                    <tr key={contract.id}>
                                        <ContractsTd>
                                            <ContractResultCell>{index + 1}</ContractResultCell>
                                        </ContractsTd>
                                        <ContractsTd>
                                            <ContractSelect
                                                value={contract.kyHan}
                                                onChange={(e) => onContractChange(contract.id, 'kyHan', e.target.value)}
                                            >
                                                <option value="">--</option>
                                                <option value="6">6</option>
                                                <option value="9">9</option>
                                                <option value="12">12</option>
                                                <option value="15">15</option>
                                                <option value="18">18</option>
                                                <option value="24">24</option>
                                            </ContractSelect>
                                        </ContractsTd>
                                        <ContractsTd>
                                            <ContractInput
                                                type="text"
                                                value={formatNumber(contract.khoanVay)}
                                                onChange={(e) => onContractChange(contract.id, 'khoanVay', parseNumber(e.target.value))}
                                                placeholder="0"
                                            />
                                        </ContractsTd>
                                        <ContractsTd>
                                            <ContractSelect
                                                value={contract.baoHiem}
                                                onChange={(e) => onContractChange(contract.id, 'baoHiem', e.target.value)}
                                            >
                                                <option value="N">N</option>
                                                <option value="Y">Y</option>
                                            </ContractSelect>
                                        </ContractsTd>
                                        <ContractsTd>
                                            <ContractInput
                                                type="text"
                                                value={contract.maScheme}
                                                onChange={(e) => onContractChange(contract.id, 'maScheme', e.target.value)}
                                                placeholder="Mã..."
                                            />
                                        </ContractsTd>
                                        <ContractsTd $highlight>
                                            <ContractResultCell $highlight>{contract.baoHiemValue}</ContractResultCell>
                                        </ContractsTd>
                                        <ContractsTd $highlight>
                                            <ContractResultCell $highlight>{contract.thuongDoanhSo}</ContractResultCell>
                                        </ContractsTd>
                                        <ContractsTd $highlight>
                                            <ContractResultCell $highlight>{contract.heSo}</ContractResultCell>
                                        </ContractsTd>
                                        <ContractsTd>
                                            <DeleteRowButton onClick={() => onDeleteContract(contract.id)}>
                                                <Trash2 size={12} />
                                            </DeleteRowButton>
                                        </ContractsTd>
                                    </tr>
                                ))}
                            </tbody>
                        </ContractsTable>
                    </ContractsTableWrapper>
                </Section>
            </motion.div>

            {/* Section 3: KẾT QUẢ - TỔNG THƯỞNG trọng tâm */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Section>
                    <SectionTitle>KẾT QUẢ</SectionTitle>

                    {/* Main Result - TỔNG THƯỞNG lớn */}
                    <MainResultCard>
                        <MainResultLabel>TỔNG THƯỞNG</MainResultLabel>
                        <MainResultValue>
                            {results.tongIncentive.tongThuong === '-'
                                ? '0 VNĐ'
                                : `${formatNumber(results.tongIncentive.tongThuong)} VNĐ`}
                        </MainResultValue>
                    </MainResultCard>

                    {/* Detail Cards - 3 loại thưởng */}
                    <div style={{ padding: '0.5rem' }}>
                        <DetailCardsRow>
                            <DetailCard>
                                <DetailCardLabel>Thưởng đạt Target</DetailCardLabel>
                                <DetailCardValue>{results.tongIncentive.thuongDatTarget}</DetailCardValue>
                            </DetailCard>
                            <DetailCard>
                                <DetailCardLabel>Thưởng DS theo HS Risk</DetailCardLabel>
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

            {/* Section 4: CHI TIẾT TÍNH TOÁN - Key-value pairs gọn */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
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
                            <KeyValueItem>
                                <KeyLabel>TARGET DI</KeyLabel>
                                <KeyValue>{formatNumber(results.thuongDatChiTieu.targetDI)}</KeyValue>
                            </KeyValueItem>
                            <KeyValueItem>
                                <KeyLabel>Kênh</KeyLabel>
                                <KeyValue>{results.thuongDoanhSoRisk.kenh}</KeyValue>
                            </KeyValueItem>
                        </KeyValueGrid>
                    </div>
                </Section>
            </motion.div>
        </Container>
    );
};

export default DLBonusDesktop;
