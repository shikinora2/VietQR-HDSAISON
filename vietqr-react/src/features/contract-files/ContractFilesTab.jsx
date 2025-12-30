import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, FileText, Trash2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract } from '../../contexts/ContractContext';
import usePdfProcessor from '../../hooks/usePdfProcessor';
import { useToast } from '../../contexts';
import { useLocalStorage } from '../../hooks';
import { Button, Loading } from '../../components';
import FileUploadZone from './FileUploadZone';
import ContractFileCard from './ContractFileCard';
import PrintDialog from './PrintDialog';
import POSSelector from './POSSelector';
import { generateContractFileSet, generatePdkPdfBytes } from '../../utils/pdfUtils';

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

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const FilesList = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  grid-template-columns: 1fr;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
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

const ContractFilesTab = () => {
  const { contracts, addContract, updateContract, deleteContract } = useContract();
  const { processPdf, processMultiplePdfs, isProcessing, progress } = usePdfProcessor();
  const toast = useToast();

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
            fileSet = await generateContractFileSet({
              file,
              qrData: data.qrData,
              pdkData: data,
              brandName: '',
              posId: selectedPOS
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

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả file?')) {
      files.forEach(file => deleteContract(file.id));
      setFiles([]);
      setSelectedFiles([]);
      toast.success('Đã xóa tất cả file');
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(files.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  return (
    <Container>
      <Header>
        <Title>🖨️ In bộ hợp đồng</Title>
        <Actions>
          {files.length > 0 && (
            <>
              {selectedFiles.length > 0 ? (
                <>
                  <Button
                    variant="primary"
                    icon={<Printer size={18} />}
                    onClick={handlePrintSelected}
                  >
                    In ({selectedFiles.length})
                  </Button>
                  <Button variant="secondary" onClick={deselectAll}>
                    Bỏ chọn
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={selectAll}>
                  Chọn tất cả
                </Button>
              )}
              <Button
                variant="ghost"
                icon={<Trash2 size={18} />}
                onClick={handleClearAll}
              >
                Xóa tất cả
              </Button>
            </>
          )}
        </Actions>
      </Header>

      {/* POS section */}
      <POSSelector onChange={(posId) => handlePosChange(posId)} />

      <FileUploadZone onFilesUpload={handleFilesUpload} />

      {isProcessing && (
        <div style={{ marginTop: '2rem' }}>
          <Loading type="progress" progress={progress} />
        </div>
      )}

      {files.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyIcon>📂</EmptyIcon>
          <EmptyText>
            Chưa có file nào. Kéo thả hoặc nhấn vào vùng phía trên để tải lên.
          </EmptyText>
        </EmptyState>
      ) : (
        <FilesList>
          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <ContractFileCard
                  file={file}
                  isSelected={selectedFiles.includes(file.id)}
                  onToggleSelect={() => toggleFileSelection(file.id)}
                  onUpdate={(updates) => handleUpdateFile(file.id, updates)}
                  onDelete={() => handleDeleteFile(file.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </FilesList>
      )}

      {showPrintDialog && (
        <PrintDialog
          files={files.filter(f => selectedFiles.includes(f.id))}
          onClose={() => setShowPrintDialog(false)}
        />
      )}
    </Container>
  );
};

export default ContractFilesTab;
