/**
 * DL Bonus Calculator - Main Tab Component
 * Responsive switching between Desktop and Mobile layouts
 * Auto-calculation with realtime updates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useBreakpoint } from '../../hooks/useResponsive';
import { useToast } from '../../contexts';
import * as XLSX from 'xlsx';
import DLBonusDesktop from './DLBonusDesktop';
import DLBonusMobile from './DLBonusMobile';
import { calculateDLBonus } from './dlBonusCalculator';

// Empty contract row template
const createEmptyContract = (id) => ({
    id,
    ngayLamHD: '',
    tenKhachHang: '',
    soHD: '',
    kyHan: '',
    khoanVay: '',
    baoHiem: 'N',  // Y or N
    diemScheme: '',  // A, B, C, D
    // Calculated fields
    calculatedInsurance: 0,
    calculatedDS: 0,
    calculatedHeSo: 0,
});

// Format number helper
const formatNumber = (num) => {
    if (num === '-' || num === null || num === undefined || num === '' || isNaN(num)) return '-';
    return Number(num).toLocaleString('vi-VN');
};

const DLBonusTab = () => {
    const { isMobileOrTablet } = useBreakpoint();

    // Input data state
    const [formData, setFormData] = useState({
        targetDL: 300000000,
        targetED: 230000000,
        doanhSoED: 230000000,
        pr3DL: 85,
        pr6DL: 90,
        ctMCED: 75,   // % Chỉ tiêu MC/ED
        ctTong: 100,  // % Chỉ tiêu tổng
    });

    // Contracts list state
    const [contracts, setContracts] = useState([
        createEmptyContract(1),
        createEmptyContract(2),
        createEmptyContract(3),
    ]);

    // Calculated results state
    const [results, setResults] = useState({
        tongIncentive: {
            thuongDatTarget: '-',
            thuongDSTheoHSRisk: '-',
            thuongBaoHiem: '-',
            tongThuong: '-',
        },
        heSoDatChiTieu: 0,
        thuongDatChiTieu: {
            targetDI: 300000000,
            giaiNganDL: '-',
            phanTramGiaiNgan: '0.00%',
            mucThuong: 0,
            heSo: 0.0,
            thuongDatTarget: '-',
        },
        thuongDoanhSoRisk: {
            kenh: 'DL',
            thuongDoanhSo: '-',
            pr3: 0,
            pr6: 0,
            heSoRisk: 0,
            thuongDoanhSoTheoRisk: '-',
        },
        details: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
        },
    });

    // Calculate and update results whenever formData or contracts change
    const recalculate = useCallback(() => {
        const result = calculateDLBonus(formData, contracts);

        // Update contracts with calculated values
        setContracts(prev => prev.map(contract => {
            const calculated = result.contractResults.find(c => c.id === contract.id);
            if (calculated) {
                return {
                    ...contract,
                    calculatedInsurance: calculated.calculatedInsurance,
                    calculatedDS: calculated.calculatedDS,
                    calculatedHeSo: calculated.calculatedHeSo,
                };
            }
            return contract;
        }));

        // Update results
        setResults({
            tongIncentive: {
                thuongDatTarget: formatNumber(result.thuongDatTarget),
                thuongDSTheoHSRisk: formatNumber(result.thuongDoanhSo),
                thuongBaoHiem: formatNumber(result.thuongBaoHiem),
                tongThuong: result.tongThuongSI,
            },
            heSoDatChiTieu: result.details.C,
            thuongDatChiTieu: {
                targetDI: formData.targetDL,
                giaiNganDL: formatNumber(result.details.tongDoanhSoDL),
                phanTramGiaiNgan: `${result.details.percentDatDL}%`,
                mucThuong: result.details.thuongDatChiTieu,
                heSo: result.details.heSoVuot,
                thuongDatTarget: formatNumber(result.thuongDatTarget),
            },
            thuongDoanhSoRisk: {
                kenh: 'DL',
                thuongDoanhSo: formatNumber(result.thuongDoanhSo),
                pr3: formData.pr3DL,
                pr6: formData.pr6DL,
                heSoRisk: result.details.heSoPr,
                thuongDoanhSoTheoRisk: formatNumber(result.thuongDoanhSo),
            },
            details: {
                A: result.details.A,
                B: result.details.B,
                C: result.details.C,
                D: result.details.D,
                ctMCED: result.details.ctMCED,
                ctTong: result.details.ctTong,
            },
        });
    }, [formData, contracts]);

    // Trigger recalculation when inputs change
    useEffect(() => {
        recalculate();
    }, [formData]); // Only recalc on formData change, contracts handled separately

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle contract row changes with auto-recalculation
    const handleContractChange = (contractId, field, value) => {
        setContracts(prev => {
            const updated = prev.map(contract =>
                contract.id === contractId
                    ? { ...contract, [field]: value }
                    : contract
            );
            // Trigger recalculation after state update
            setTimeout(() => {
                const result = calculateDLBonus(formData, updated);

                setContracts(current => current.map(contract => {
                    const calculated = result.contractResults.find(c => c.id === contract.id);
                    if (calculated) {
                        return {
                            ...contract,
                            calculatedInsurance: calculated.calculatedInsurance,
                            calculatedDS: calculated.calculatedDS,
                            calculatedHeSo: calculated.calculatedHeSo,
                        };
                    }
                    return contract;
                }));

                setResults({
                    tongIncentive: {
                        thuongDatTarget: formatNumber(result.thuongDatTarget),
                        thuongDSTheoHSRisk: formatNumber(result.thuongDoanhSo),
                        thuongBaoHiem: formatNumber(result.thuongBaoHiem),
                        tongThuong: result.tongThuongSI,
                    },
                    heSoDatChiTieu: result.details.C,
                    thuongDatChiTieu: {
                        targetDI: formData.targetDL,
                        giaiNganDL: formatNumber(result.details.tongDoanhSoDL),
                        phanTramGiaiNgan: `${result.details.percentDatDL}%`,
                        mucThuong: result.details.thuongDatChiTieu,
                        heSo: result.details.heSoVuot,
                        thuongDatTarget: formatNumber(result.thuongDatTarget),
                    },
                    thuongDoanhSoRisk: {
                        kenh: 'DL',
                        thuongDoanhSo: formatNumber(result.thuongDoanhSo),
                        pr3: formData.pr3DL,
                        pr6: formData.pr6DL,
                        heSoRisk: result.details.heSoPr,
                        thuongDoanhSoTheoRisk: formatNumber(result.thuongDoanhSo),
                    },
                    details: {
                        A: result.details.A,
                        B: result.details.B,
                        C: result.details.C,
                        D: result.details.D,
                    },
                });
            }, 0);

            return updated;
        });
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
        setContracts(prev => {
            const updated = prev.filter(c => c.id !== contractId);
            // Trigger recalculation
            setTimeout(() => {
                const result = calculateDLBonus(formData, updated);
                setResults({
                    tongIncentive: {
                        thuongDatTarget: formatNumber(result.thuongDatTarget),
                        thuongDSTheoHSRisk: formatNumber(result.thuongDoanhSo),
                        thuongBaoHiem: formatNumber(result.thuongBaoHiem),
                        tongThuong: result.tongThuongSI,
                    },
                    heSoDatChiTieu: result.details.C,
                    thuongDatChiTieu: {
                        targetDI: formData.targetDL,
                        giaiNganDL: formatNumber(result.details.tongDoanhSoDL),
                        phanTramGiaiNgan: `${result.details.percentDatDL}%`,
                        mucThuong: result.details.thuongDatChiTieu,
                        heSo: result.details.heSoVuot,
                        thuongDatTarget: formatNumber(result.thuongDatTarget),
                    },
                    thuongDoanhSoRisk: {
                        kenh: 'DL',
                        thuongDoanhSo: formatNumber(result.thuongDoanhSo),
                        pr3: formData.pr3DL,
                        pr6: formData.pr6DL,
                        heSoRisk: result.details.heSoPr,
                        thuongDoanhSoTheoRisk: formatNumber(result.thuongDoanhSo),
                    },
                    details: {
                        A: result.details.A,
                        B: result.details.B,
                        C: result.details.C,
                        D: result.details.D,
                    },
                });
            }, 0);
            return updated;
        });
    };

    // Reset form to default values
    const handleReset = () => {
        setFormData({
            targetDL: 300000000,
            targetED: 230000000,
            doanhSoED: 230000000,
            pr3DL: 85,
            pr6DL: 90,
            ctMCED: 75,
            ctTong: 100,
        });
        setContracts([
            createEmptyContract(1),
            createEmptyContract(2),
            createEmptyContract(3),
        ]);
    };

    // Toast hook
    const { showToast } = useToast();

    // Export to Excel
    const handleExportExcel = () => {
        // Filter valid contracts (có nhập khoản vay)
        const validContracts = contracts.filter(c => c.khoanVay && c.khoanVay > 0);

        if (validContracts.length === 0) {
            showToast('Vui lòng nhập ít nhất 1 hợp đồng để xuất Excel', 'warning');
            return;
        }

        // Sheet 1: Thông tin tổng quan
        const infoData = [
            ['THÔNG TIN TÍNH THƯỞNG DL'],
            [],
            ['THÔNG SỐ ĐẦU VÀO'],
            ['Target DL', formData.targetDL],
            ['Target ED', formData.targetED],
            ['Doanh số ED', formData.doanhSoED],
            ['PR3 DL (%)', formData.pr3DL],
            ['PR6 DL (%)', formData.pr6DL],
            [],
            ['KẾT QUẢ TÍNH TOÁN'],
            ['Thành phần', 'Giá trị'],
            ['A: Thưởng DS × Hệ số Pr', results.details?.A || 0],
            ['B: Thưởng chỉ tiêu × Hệ số vượt', results.details?.B || 0],
            ['C: Hệ số ngành hàng', results.details?.C || 0],
            ['D: Thưởng bảo hiểm', results.details?.D || 0],
            [],
            ['Công thức: (A + B) × C + D'],
            ['TỔNG THƯỞNG', results.tongIncentive?.tongThuong || 0],
            [],
            ['CHI TIẾT THƯỞNG'],
            ['Thưởng đạt Target', results.tongIncentive?.thuongDatTarget || '-'],
            ['Thưởng DS theo HS Risk', results.tongIncentive?.thuongDSTheoHSRisk || '-'],
            ['Thưởng Bảo Hiểm', results.tongIncentive?.thuongBaoHiem || '-'],
            [],
            ['HỆ SỐ'],
            ['Hệ số Pr3\\Pr6', results.thuongDoanhSoRisk?.heSoRisk || 0],
            ['Hệ số vượt chỉ tiêu', results.thuongDatChiTieu?.heSo || 0],
            ['% Giải ngân DL', results.thuongDatChiTieu?.phanTramGiaiNgan || '0%'],
            ['Tổng giải ngân DL', results.thuongDatChiTieu?.giaiNganDL || '-'],
        ];

        // Sheet 2: Chi tiết hợp đồng
        const contractHeaders = ['STT', 'Kỳ hạn (tháng)', 'Khoản vay', 'Bảo hiểm', 'Điểm Scheme', 'Thưởng BH', 'Thưởng DS', 'Hệ số (%)'];
        const contractRows = validContracts.map((contract, index) => [
            index + 1,
            contract.kyHan || '-',
            contract.khoanVay || 0,
            contract.baoHiem === 'Y' ? 'Có' : 'Không',
            contract.diemScheme || '-',
            contract.calculatedInsurance || 0,
            contract.calculatedDS || 0,
            contract.calculatedHeSo || 0,
        ]);
        const contractData = [contractHeaders, ...contractRows];

        // Tạo workbook
        const wb = XLSX.utils.book_new();

        // Sheet 1: Thông tin
        const ws1 = XLSX.utils.aoa_to_sheet(infoData);
        ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Thông tin');

        // Sheet 2: Chi tiết HĐ
        const ws2 = XLSX.utils.aoa_to_sheet(contractData);
        ws2['!cols'] = [
            { wch: 6 },   // STT
            { wch: 15 },  // Kỳ hạn
            { wch: 18 },  // Khoản vay
            { wch: 12 },  // Bảo hiểm
            { wch: 15 },  // Điểm Scheme
            { wch: 15 },  // Thưởng BH
            { wch: 18 },  // Thưởng DS
            { wch: 12 },  // Hệ số
        ];
        XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết HĐ');

        // Xuất file
        const fileName = `TinhThuong_DL_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showToast(`Đã xuất file ${fileName} thành công!`, 'success');
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
        onExportExcel: handleExportExcel,
    };

    return isMobileOrTablet ? (
        <DLBonusMobile {...layoutProps} />
    ) : (
        <DLBonusDesktop {...layoutProps} />
    );
};

export default DLBonusTab;
