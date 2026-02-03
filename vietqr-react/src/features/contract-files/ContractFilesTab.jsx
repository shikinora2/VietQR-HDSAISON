import React, { useState } from 'react';
import { useContract } from '../../contexts/ContractContext';
import usePdfProcessor from '../../hooks/usePdfProcessor';
import { useToast } from '../../contexts';
import { useLocalStorage } from '../../hooks';
import { useBreakpoint } from '../../hooks/useResponsive';
import { generateContractFileSet, generatePdkPdfBytes } from '../../utils/pdfUtils';
import PrintDialog from './PrintDialog';
import ContractFilesDesktop from './ContractFilesDesktop';
import ContractFilesMobile from './ContractFilesMobile';

const ContractFilesTab = () => {
  const { contracts, addContract, updateContract, deleteContract } = useContract();
  const { processPdf, processMultiplePdfs, isProcessing, progress } = usePdfProcessor();
  const toast = useToast();
  const { isMobileOrTablet } = useBreakpoint();

  const [files, setFiles] = useState([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPOS, setSelectedPOS] = useLocalStorage('selectedPos', 'POS24414');

  // Handle POS change - regenerate PDK for all contracts
  const handlePosChange = async (posId) => {
    setSelectedPOS(posId);

    // Regenerate PDK for all existing files
    if (files.length > 0) {
      toast.info('Đang cập nhật mẫu PDK cho tất cả hợp đồng...');

      const updatedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            // Only regenerate if not DL contract
            const contractType = file.shd?.startsWith('DL') ? 'DL' : 'DEFAULT';
            if (contractType !== 'DL' && file.fileSet) {
              const pdkBytes = await generatePdkPdfBytes(file, file.brandName || '', posId);
              if (pdkBytes) {
                // Revoke old URL
                if (file.fileSet.pdkUrl) {
                  URL.revokeObjectURL(file.fileSet.pdkUrl);
                }
                const pdkUrl = URL.createObjectURL(new Blob([pdkBytes], { type: 'application/pdf' }));
                return {
                  ...file,
                  fileSet: { ...file.fileSet, pdkUrl }
                };
              }
            }
          } catch (e) {
            console.warn('Error regenerating PDK for', file.shd, e);
          }
          return file;
        })
      );

      setFiles(updatedFiles);
      toast.success('Đã cập nhật mẫu PDK!');
    }
  };

  const handleFilesUpload = async (uploadedFiles) => {
    console.log('[ContractFilesTab] handleFilesUpload called with:', uploadedFiles);
    try {
      toast.info(`Bắt đầu xử lý ${uploadedFiles.length} file...`);

      const results = await processMultiplePdfs(
        uploadedFiles,
        (current, total, fileName) => {
          console.log(`[ContractFilesTab] Processing ${current}/${total}: ${fileName}`);
          toast.info(`Đang xử lý ${current}/${total}: ${fileName}`);
        }
      );

      console.log('[ContractFilesTab] processMultiplePdfs results:', results);

      // Generate file sets and add to contracts
      const newContractsPromises = results.map(async (data) => {
        const file = uploadedFiles.find(f => f.name === data.fileName);
        console.log('[ContractFilesTab] Processing result:', data);

        let fileSet = null;
        try {
          if (file && data.qrData) {
            console.log('[ContractFilesTab] Generating file set for:', data.fileName);

            // Determine program type based on product
            // "0% - có trả trước" for phone products, "0% - Không trả trước" for others
            const sanPham = (data.sanPham || '').toUpperCase();
            const isPhone = sanPham.includes('ĐIỆN THOẠI') ||
              sanPham.includes('DIEN THOAI') ||
              sanPham.includes('PHONE') ||
              sanPham.includes('IPHONE') ||
              sanPham.includes('SAMSUNG') ||
              sanPham.includes('OPPO') ||
              sanPham.includes('XIAOMI') ||
              sanPham.includes('REALME') ||
              sanPham.includes('VIVO');
            const chuongTrinh = isPhone ? '0% - có trả trước' : '0% - Không trả trước';

            // Create infoBoxData
            const infoBoxData = {
              chuongTrinh: chuongTrinh,
              thoiHanVay: data.thoiHanVay || data.thoiHan || '',
              laiSuat: '0',  // Always 0% for all products
              phiBaoHiem: data.insuranceFee || ''
            };

            fileSet = await generateContractFileSet({
              file,
              qrData: data.qrData,
              pdkData: data,
              brandName: '',
              posId: selectedPOS,
              infoBoxData: infoBoxData
            });
            console.log('[ContractFilesTab] Generated file set:', fileSet);
          }
        } catch (e) {
          console.error("[ContractFilesTab] Error generating file set for " + data.fileName, e);
        }

        const contract = {
          ...data,
          id: Date.now() + Math.random(),
          contractNumber: data.shd || data.qrData?.contract || '', // Map shd to contractNumber
          file: file,
          fileSet: fileSet,
          brandName: '',
        };
        addContract(contract);
        return contract;
      });

      const newContracts = await Promise.all(newContractsPromises);
      console.log('[ContractFilesTab] New contracts created:', newContracts);

      setFiles(prev => [...prev, ...newContracts]);
      toast.success(`Đã tải lên ${results.length} file thành công`);
    } catch (error) {
      console.error('[ContractFilesTab] handleFilesUpload error:', error);
      toast.error('Lỗi khi xử lý PDF: ' + error.message);
    }
  };

  const handleUpdateFile = (fileId, updates) => {
    setFiles(prev =>
      prev.map(file => (file.id === fileId ? { ...file, ...updates } : file))
    );
    updateContract(fileId, updates);
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Bạn có chắc muốn xóa file này?')) {
      setFiles(prev => prev.filter(file => file.id !== fileId));
      deleteContract(fileId);
      toast.success('Đã xóa file');
    }
  };

  const handlePrintSelected = () => {
    const selected = files.filter(f => selectedFiles.includes(f.id));
    if (selected.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }
    setShowPrintDialog(true);
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  // Common props for both layouts
  const layoutProps = {
    files,
    selectedFiles,
    isProcessing,
    progress,
    onFilesUpload: handleFilesUpload,
    onPosChange: handlePosChange,
    onToggleSelect: toggleFileSelection,
    onUpdateFile: handleUpdateFile,
    onDeleteFile: handleDeleteFile,
    onPrintSelected: handlePrintSelected,
    onDeselectAll: deselectAll,
  };

  return (
    <>
      {isMobileOrTablet ? (
        <ContractFilesMobile {...layoutProps} />
      ) : (
        <ContractFilesDesktop {...layoutProps} />
      )}

      {showPrintDialog && (
        <PrintDialog
          files={files.filter(f => selectedFiles.includes(f.id))}
          onClose={() => setShowPrintDialog(false)}
        />
      )}
    </>
  );
};

export default ContractFilesTab;

