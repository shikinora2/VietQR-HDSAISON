import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Download, Printer, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract } from '../../contexts/ContractContext';
import useQRGenerator from '../../hooks/useQRGenerator';
import { useToast } from '../../contexts';
import { Button } from '../../components/atoms';
import QRRowItem from './QRRowItem';
import QRModal from './QRModal';

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
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.light};
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

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const QRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`;

// Desktop Header Row - visible only on larger screens
const HeaderRow = styled.div`
  display: none;
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

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }
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

const QRGeneratorTab = () => {
  const { contracts, addContract, deleteContract } = useContract();
  const { generateContractQRCode, downloadMultipleQRs, isGenerating } = useQRGenerator();
  const { showToast } = useToast();

  const [qrRows, setQrRows] = useState([]);
  const [selectedModal, setSelectedModal] = useState(null);

  // Initialize with existing contracts or empty row
  useEffect(() => {
    if (contracts.length > 0) {
      setQrRows(contracts);
    } else {
      setQrRows([createEmptyRow()]);
    }
  }, []);

  const createEmptyRow = () => ({
    id: Date.now() + Math.random(),
    contractNumber: '',
    customerName: '',
    amount: '',
    phoneNumber: '',
    isNew: true,
  });

  const handleAddRow = () => {
    const newRow = createEmptyRow();
    setQrRows(prev => [...prev, newRow]);
    showToast('Đã thêm hàng mới', 'success');
  };

  const handleUpdateRow = (id, data) => {
    setQrRows(prev =>
      prev.map(row => (row.id === id ? { ...row, ...data, isNew: false } : row))
    );

    // Auto-save to context if data is complete
    if (data.contractNumber && data.customerName && data.amount) {
      const existing = contracts.find(c => c.id === id);
      if (existing) {
        // Update existing
        // Note: We'll implement updateContract in context later
      } else {
        // Add new
        addContract(data);
      }
    }
  };

  const handleDeleteRow = (id) => {
    if (qrRows.length === 1) {
      showToast('Không thể xóa hàng cuối cùng', 'error');
      return;
    }

    setQrRows(prev => prev.filter(row => row.id !== id));
    deleteContract(id);
    showToast('Đã xóa hàng', 'success');
  };

  const handleDuplicateRow = (row) => {
    const newRow = {
      ...row,
      id: Date.now() + Math.random(),
      contractNumber: '',
      isNew: true,
    };
    setQrRows(prev => [...prev, newRow]);
    showToast('Đã nhân bản hàng', 'success');
  };

  const handleDownloadAll = async () => {
    const validRows = qrRows.filter(
      row => row.contractNumber && row.customerName && row.amount
    );

    if (validRows.length === 0) {
      showToast('Không có dữ liệu để tải xuống', 'error');
      return;
    }

    try {
      await downloadMultipleQRs(validRows, (current, total) => {
        showToast(`Đang tải ${current}/${total}...`, 'info');
      });
      showToast(`Đã tải xuống ${validRows.length} mã QR`, 'success');
    } catch (error) {
      showToast('Lỗi khi tải xuống: ' + error.message, 'error');
    }
  };

  const handlePrintAll = () => {
    const validRows = qrRows.filter(
      row => row.contractNumber && row.customerName && row.amount
    );

    if (validRows.length === 0) {
      showToast('Không có dữ liệu để in', 'error');
      return;
    }

    // Generate all QR URLs
    const qrUrls = validRows.map(row => ({
      url: generateContractQRCode(row),
      contract: row,
    }));

    // Create print window
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Mã QR</title>
          <style>
            body {
              font-family: 'IBM Plex Sans', sans-serif;
              padding: 20px;
            }
            .qr-item {
              page-break-inside: avoid;
              margin-bottom: 30px;
              text-align: center;
            }
            .qr-item img {
              width: 300px;
              height: 300px;
            }
            .qr-info {
              margin-top: 10px;
              font-size: 14px;
            }
            @media print {
              .qr-item {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          ${qrUrls
        .map(
          ({ url, contract }) => `
            <div class="qr-item">
              <img src="${url}" alt="QR Code" />
              <div class="qr-info">
                <div><strong>Hợp đồng:</strong> ${contract.contractNumber}</div>
                <div><strong>Khách hàng:</strong> ${contract.customerName}</div>
                <div><strong>Số tiền:</strong> ${contract.amount}</div>
              </div>
            </div>
          `
        )
        .join('')}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả các hàng?')) {
      setQrRows([createEmptyRow()]);
      qrRows.forEach(row => deleteContract(row.id));
      showToast('Đã xóa tất cả', 'success');
    }
  };

  const handleViewQR = (row) => {
    if (!row.contractNumber || !row.customerName || !row.amount) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    setSelectedModal(row);
  };

  return (
    <Container>
      <Header>
        <Title>🏦 Tạo Mã QR Chuyển Khoản</Title>
        <Actions>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={handleAddRow}
          >
            Thêm Hàng
          </Button>
          <Button
            variant="secondary"
            icon={<Download size={18} />}
            onClick={handleDownloadAll}
            disabled={isGenerating}
          >
            Tải Tất Cả
          </Button>
          <Button
            variant="secondary"
            icon={<Printer size={18} />}
            onClick={handlePrintAll}
          >
            In Tất Cả
          </Button>
          <Button
            variant="ghost"
            icon={<Trash2 size={18} />}
            onClick={handleClearAll}
          >
            Xóa Tất Cả
          </Button>
        </Actions>
      </Header>

      {qrRows.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyIcon>📱</EmptyIcon>
          <EmptyText>Chưa có dữ liệu. Nhấn "Thêm Hàng" để bắt đầu.</EmptyText>
          <Button variant="primary" icon={<Plus size={18} />} onClick={handleAddRow}>
            Thêm Hàng Đầu Tiên
          </Button>
        </EmptyState>
      ) : (
        <QRList>
          {/* Desktop Header Row */}
          <HeaderRow>
            <HeaderColumn>Số hợp đồng</HeaderColumn>
            <HeaderColumn>Họ tên</HeaderColumn>
            <HeaderColumn>Số tiền (VND)</HeaderColumn>
            <HeaderColumn>Thao tác</HeaderColumn>
          </HeaderRow>

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
                  onUpdate={(data) => handleUpdateRow(row.id, data)}
                  onDelete={() => handleDeleteRow(row.id)}
                  onDuplicate={() => handleDuplicateRow(row)}
                  onViewQR={() => handleViewQR(row)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </QRList>
      )}

      {/* QR Preview Modal */}
      {selectedModal && (
        <QRModal
          contract={selectedModal}
          onClose={() => setSelectedModal(null)}
        />
      )}
    </Container>
  );
};

export default QRGeneratorTab;
