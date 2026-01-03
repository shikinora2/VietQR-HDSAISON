import React, { useState, useEffect } from 'react';
import useQRGenerator from '../../hooks/useQRGenerator';
import usePdfProcessor from '../../hooks/usePdfProcessor';
import { useToast } from '../../contexts';
import { useBreakpoint } from '../../hooks/useResponsive';
import QRModal from './QRModal';
import QRGeneratorDesktop from './QRGeneratorDesktop';
import QRGeneratorMobile from './QRGeneratorMobile';

// Bank accounts configuration
const BANK_ACCOUNTS = [
  {
    id: 'hdsaison',
    bankName: 'HD SAISON (HDBANK)',
    bankCode: '970437',
    accountNumber: '002704070014601',
    accountName: 'HD SAISON',
  },
];

const QRGeneratorTab = () => {
  const { generateContractQRCode } = useQRGenerator();
  const { processMultiplePdfs, isProcessing } = usePdfProcessor();
  const toast = useToast();
  const { isMobileOrTablet } = useBreakpoint();
  const fileInputRef = React.useRef(null);

  const [qrRows, setQrRows] = useState([]);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedBank, setSelectedBank] = useState(BANK_ACCOUNTS[0]);

  useEffect(() => {
    setQrRows([createEmptyRow()]);
  }, []);

  const createEmptyRow = () => ({
    id: Date.now() + Math.random(),
    contractNumber: '',
    customerName: '',
    amount: '',
    phoneNumber: '',
    isNew: true,
  });

  const handleAddRow = (showToast = true) => {
    const newRow = createEmptyRow();
    setQrRows(prev => [...prev, newRow]);
    if (showToast) {
      toast.success('Đã thêm hàng mới');
    }
  };

  const handleUpdateRow = (id, data) => {
    setQrRows(prev =>
      prev.map(row => (row.id === id ? { ...row, ...data, isNew: false } : row))
    );
  };

  const handleDeleteRow = (id) => {
    if (qrRows.length === 1) {
      toast.error('Không thể xóa hàng cuối cùng');
      return;
    }
    setQrRows(prev => prev.filter(row => row.id !== id));
    toast.success('Đã xóa hàng');
  };

  const handleDuplicateRow = (row) => {
    const newRow = {
      ...row,
      id: Date.now() + Math.random(),
      contractNumber: '',
      isNew: true,
    };
    setQrRows(prev => [...prev, newRow]);
    toast.success('Đã nhân bản hàng');
  };

  const handleViewQR = (row) => {
    if (!row.contractNumber || !row.amount) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSelectedModal(row);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      toast.info(`Đang xử lý ${files.length} file...`);
      const results = await processMultiplePdfs(files);
      console.log('[QRGeneratorTab] processMultiplePdfs results:', results);

      setQrRows(prev => {
        const nextRows = [...prev];
        let resultIdx = 0;

        // Fill existing empty rows first
        for (let i = 0; i < nextRows.length && resultIdx < results.length; i++) {
          const row = nextRows[i];
          const isEmpty = !row.contractNumber && !row.customerName && !row.amount;

          if (isEmpty) {
            const data = results[resultIdx];
            nextRows[i] = {
              ...row,
              contractNumber: data.shd || data.qrData?.contract || '',
              customerName: data.customerName || data.qrData?.name || '',
              amount: (data.amount || data.qrData?.amount) ? (data.amount || data.qrData?.amount).toString().replace(/\D/g, '') : '',
              isNew: false
            };
            resultIdx++;
          }
        }

        // Append remaining results
        while (resultIdx < results.length) {
          const data = results[resultIdx];
          nextRows.push({
            id: Date.now() + Math.random(),
            contractNumber: data.shd || data.qrData?.contract || '',
            customerName: data.customerName || data.qrData?.name || '',
            amount: (data.amount || data.qrData?.amount) ? (data.amount || data.qrData?.amount).toString().replace(/\D/g, '') : '',
            phoneNumber: '',
            isNew: true,
          });
          resultIdx++;
        }

        return nextRows;
      });

      toast.success(`Đã thêm ${results.length} hợp đồng từ file`);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Lỗi xử lý file: ' + error.message);
    }
  };

  // Common props for both layouts
  const layoutProps = {
    qrRows,
    selectedBank,
    bankAccounts: BANK_ACCOUNTS,
    isProcessing,
    fileInputRef,
    onAddRow: handleAddRow,
    onUpdateRow: handleUpdateRow,
    onDeleteRow: handleDeleteRow,
    onDuplicateRow: handleDuplicateRow,
    onViewQR: handleViewQR,
    onBankChange: setSelectedBank,
    onFileUpload: handleFileUpload,
  };

  return (
    <>
      {isMobileOrTablet ? (
        <QRGeneratorMobile {...layoutProps} />
      ) : (
        <QRGeneratorDesktop {...layoutProps} />
      )}

      {/* QR Preview Modal */}
      {selectedModal && (
        <QRModal
          contract={selectedModal}
          bank={selectedBank}
          onClose={() => setSelectedModal(null)}
        />
      )}
    </>
  );
};

export default QRGeneratorTab;

