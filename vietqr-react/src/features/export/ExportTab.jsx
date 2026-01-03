import React, { useState } from 'react';
import { useContract } from '../../contexts/ContractContext';
import usePdfProcessor from '../../hooks/usePdfProcessor';
import { useToast } from '../../contexts';
import { useBreakpoint } from '../../hooks/useResponsive';
import * as XLSX from 'xlsx';
import ExportDesktop from './ExportDesktop';
import ExportMobile from './ExportMobile';

const ExportTab = () => {
  const { contracts, addContract } = useContract();
  const { processMultiplePdfs, isProcessing, progress } = usePdfProcessor();
  const { showToast } = useToast();
  const { isMobileOrTablet } = useBreakpoint();

  const [data, setData] = useState(contracts);
  const [filteredData, setFilteredData] = useState(contracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Update data when contracts change
  React.useEffect(() => {
    setData(contracts);
    handleSearch(searchQuery, contracts);
  }, [contracts]);

  const handleSearch = (query, dataToSearch = data) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredData(dataToSearch);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = dataToSearch.filter(row =>
      row.contractNumber?.toLowerCase().includes(lowerQuery) ||
      row.customerName?.toLowerCase().includes(lowerQuery) ||
      row.phoneNumber?.includes(query) ||
      row.idNumber?.includes(query)
    );

    setFilteredData(filtered);
  };

  const handlePDFUpload = async (files) => {
    try {
      const results = await processMultiplePdfs(
        files,
        (current, total, fileName) => {
          showToast(`Đang xử lý ${current}/${total}: ${fileName}`, 'info');
        }
      );

      results.forEach(result => addContract(result));
      showToast(`Đã trích xuất ${results.length} file thành công`, 'success');
    } catch (error) {
      showToast('Lỗi khi xử lý PDF: ' + error.message, 'error');
    }
  };

  const handleExportExcel = () => {
    const exportData = selectedRows.length > 0
      ? filteredData.filter(row => selectedRows.includes(row.id))
      : filteredData;

    if (exportData.length === 0) {
      showToast('Không có dữ liệu để xuất', 'error');
      return;
    }

    const worksheetData = exportData.map(row => ({
      'Số Hợp Đồng': row.contractNumber || '',
      'Tên Khách Hàng': row.customerName || '',
      'CMND/CCCD': row.idNumber || '',
      'Số Điện Thoại': row.phoneNumber || '',
      'Địa Chỉ': row.address || '',
      'Số Tiền': row.amount || '',
      'Phí Bảo Hiểm': row.insuranceFee || '',
      'Ngày Hiệu Lực': row.effectiveDate || '',
      'Ngày Đáo Hạn': row.dueDate || '',
      'Kỳ Thanh Toán': row.paymentTerm || '',
      'Ngày Tạo': row.createdAt ? new Date(row.createdAt).toLocaleDateString('vi-VN') : '',
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hợp Đồng');

    const colWidths = Object.keys(worksheetData[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...worksheetData.map(row => String(row[key] || '').length)
      ) + 2
    }));
    ws['!cols'] = colWidths;

    const fileName = `HopDong_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`Đã xuất ${exportData.length} hợp đồng ra Excel`, 'success');
  };

  const handleExportCSV = () => {
    const exportData = selectedRows.length > 0
      ? filteredData.filter(row => selectedRows.includes(row.id))
      : filteredData;

    if (exportData.length === 0) {
      showToast('Không có dữ liệu để xuất', 'error');
      return;
    }

    const headers = ['Số Hợp Đồng', 'Tên Khách Hàng', 'CMND/CCCD', 'Số Điện Thoại', 'Địa Chỉ', 'Số Tiền', 'Phí Bảo Hiểm', 'Ngày Hiệu Lực', 'Ngày Đáo Hạn'];
    const rows = exportData.map(row => [
      row.contractNumber || '',
      row.customerName || '',
      row.idNumber || '',
      row.phoneNumber || '',
      row.address || '',
      row.amount || '',
      row.insuranceFee || '',
      row.effectiveDate || '',
      row.dueDate || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `HopDong_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast(`Đã xuất ${exportData.length} hợp đồng ra CSV`, 'success');
  };

  const handleExportGoogleSheets = async () => {
    showToast('Chức năng Google Sheets đang được phát triển', 'info');
  };

  const handleRowSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

  const layoutProps = {
    filteredData,
    selectedRows,
    searchQuery,
    isProcessing,
    progress,
    onSearch: handleSearch,
    onPDFUpload: handlePDFUpload,
    onExportExcel: handleExportExcel,
    onExportCSV: handleExportCSV,
    onExportGoogleSheets: handleExportGoogleSheets,
    onRowSelectionChange: handleRowSelectionChange,
  };

  return isMobileOrTablet ? (
    <ExportMobile {...layoutProps} />
  ) : (
    <ExportDesktop {...layoutProps} />
  );
};

export default ExportTab;

