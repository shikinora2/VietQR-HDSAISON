import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, FileSpreadsheet, Upload, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContract } from '../../contexts/ContractContext';
import usePdfProcessor from '../../hooks/usePdfProcessor';
import { useToast } from '../../contexts';
import { Button, Loading } from '../../components';
import DataTable from './DataTable';
import SearchBar from './SearchBar';
import ExportButtons from './ExportButtons';
import UploadPDFExtract from './UploadPDFExtract';
import * as XLSX from 'xlsx';

const Container = styled.div`
  width: 100%;
  /* Padding is handled by AppShell's Content wrapper */
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface.default};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.sm};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  margin: -${props => props.theme.spacing.xl} -${props => props.theme.spacing.xl} 0 -${props => props.theme.spacing.xl};
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: auto;
  }
`;

const ExportTab = () => {
  const { contracts, addContract } = useContract();
  const { processMultiplePdfs, isProcessing, progress } = usePdfProcessor();
  const { showToast } = useToast();

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

      // Add to contracts
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

    // Prepare data for export
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

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hợp Đồng');

    // Auto-size columns
    const colWidths = Object.keys(worksheetData[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...worksheetData.map(row => String(row[key] || '').length)
      ) + 2
    }));
    ws['!cols'] = colWidths;

    // Generate filename
    const fileName = `HopDong_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Export
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

    // Prepare CSV
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

    // Download
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

  return (
    <Container>
      <Header>
        <Title>📊 Xuất Dữ Liệu Hợp Đồng</Title>
      </Header>

      <UploadPDFExtract onUpload={handlePDFUpload} />

      {isProcessing && (
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <Loading type="progress" progress={progress} />
        </div>
      )}

      <Controls>
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Tìm theo số HĐ, tên KH, SĐT..."
        />
        
        <ExportButtons
          onExportExcel={handleExportExcel}
          onExportCSV={handleExportCSV}
          onExportGoogleSheets={handleExportGoogleSheets}
          selectedCount={selectedRows.length}
          totalCount={filteredData.length}
        />
      </Controls>

      <DataTable
        data={filteredData}
        selectedRows={selectedRows}
        onRowSelectionChange={handleRowSelectionChange}
      />
    </Container>
  );
};

export default ExportTab;
