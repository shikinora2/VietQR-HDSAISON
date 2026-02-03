/**
 * DL Bonus Calculator - Main Tab Component
 * Responsive switching between Desktop and Mobile layouts
 */

import React, { useState } from 'react';
import { useBreakpoint } from '../../hooks/useResponsive';
import DLBonusDesktop from './DLBonusDesktop';
import DLBonusMobile from './DLBonusMobile';

// Empty contract row template
const createEmptyContract = (id) => ({
    id,
    ngayLamHD: '',
    tenKhachHang: '',
    soHD: '',
    kyHan: '',
    khoanVay: '',
    baoHiem: 'N',  // Y or N
    maScheme: '',
    // Calculated fields (placeholder)
    baoHiemValue: '-',
    thuongDoanhSo: '-',
    heSo: '-',
});

const DLBonusTab = () => {
    const { isMobileOrTablet } = useBreakpoint();

    // Input data state
    const [formData, setFormData] = useState({
        targetDL: 300000000,
        targetED: 230000000,
        doanhSoED: 230000000,
        pr3DL: 98.00,
        pr6DL: 98.00,
    });

    // Contracts list state (chi tiết từng hợp đồng)
    const [contracts, setContracts] = useState([
        createEmptyContract(1),
        createEmptyContract(2),
        createEmptyContract(3),
    ]);

    // Calculated results state (placeholder - user will add logic later)
    const [results, setResults] = useState({
        // Tổng Incentive
        tongIncentive: {
            thuongDatTarget: '-',
            thuongDSTheoHSRisk: '-',
            thuongBaoHiem: '-',
            tongThuong: '-',
        },
        // Hệ số đạt chỉ tiêu
        heSoDatChiTieu: 0,
        // Thưởng đạt chỉ tiêu
        thuongDatChiTieu: {
            targetDI: 300000000,
            giaiNganDL: '-',
            phanTramGiaiNgan: '0.00%',
            mucThuong: 1800000,
            heSo: 0.0,
            thuongDatTarget: '-',
        },
        // Thưởng doanh số theo hệ số rủi ro
        thuongDoanhSoRisk: {
            kenh: 'DL',
            thuongDoanhSo: '-',
            pr3: 98.00,
            pr6: 98.00,
            heSoRisk: 1.3,
            thuongDoanhSoTheoRisk: '-',
        },
    });

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // TODO: User will add calculation logic here
        // calculateResults({ ...formData, [field]: value });
    };

    // Handle contract row changes
    const handleContractChange = (contractId, field, value) => {
        setContracts(prev => prev.map(contract =>
            contract.id === contractId
                ? { ...contract, [field]: value }
                : contract
        ));

        // TODO: User will add calculation logic here
    };

    // Add new contract row
    const handleAddContract = () => {
        const newId = contracts.length > 0
            ? Math.max(...contracts.map(c => c.id)) + 1
            : 1;
        setContracts(prev => [...prev, createEmptyContract(newId)]);
    };

    // Delete contract row
    const handleDeleteContract = (contractId) => {
        setContracts(prev => prev.filter(c => c.id !== contractId));
    };

    // Reset form to default values
    const handleReset = () => {
        setFormData({
            targetDL: 300000000,
            targetED: 230000000,
            doanhSoED: 230000000,
            pr3DL: 98.00,
            pr6DL: 98.00,
        });
        setContracts([
            createEmptyContract(1),
            createEmptyContract(2),
            createEmptyContract(3),
        ]);
    };

    const layoutProps = {
        formData,
        results,
        contracts,
        onFormChange: handleFormChange,
        onContractChange: handleContractChange,
        onAddContract: handleAddContract,
        onDeleteContract: handleDeleteContract,
        onReset: handleReset,
    };

    return isMobileOrTablet ? (
        <DLBonusMobile {...layoutProps} />
    ) : (
        <DLBonusDesktop {...layoutProps} />
    );
};

export default DLBonusTab;
