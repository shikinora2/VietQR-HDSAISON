import React from 'react';
import styled from 'styled-components';
import { Printer, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Loading } from '../../components';
import FileUploadZone from './FileUploadZone';
import ContractFileCard from './ContractFileCard';
import POSSelector from './POSSelector';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  flex-wrap: wrap;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: ${props => props.theme.spacing.xs};
  opacity: 0.3;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const FloatingActions = styled.div`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(248, 250, 252, 0.2);
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  z-index: 100;
`;

/**
 * Mobile Layout cho ContractFiles Tab
 * Single column layout với floating action bar
 */
const ContractFilesMobile = ({
    files,
    selectedFiles,
    isProcessing,
    progress,
    onFilesUpload,
    onPosChange,
    onToggleSelect,
    onUpdateFile,
    onDeleteFile,
    onPrintSelected,
    onDeselectAll,
}) => {
    return (
        <Container>
            <Header>
                <Title>🖨️ In hợp đồng</Title>
                <FileUploadZone onFilesUpload={onFilesUpload} variant="button" compact />
            </Header>

            <ControlsSection>
                <POSSelector onChange={onPosChange} compact />

                {isProcessing && (
                    <div style={{
                        background: '#1E293B',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                    }}>
                        <div style={{
                            color: '#FBBF24',
                            fontSize: '12px',
                            marginBottom: '6px',
                            fontWeight: 600,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>Đang xử lý...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Loading type="progress" progress={progress} />
                    </div>
                )}
            </ControlsSection>

            {files.length === 0 ? (
                <EmptyState
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <EmptyIcon>📂</EmptyIcon>
                    <EmptyText>
                        Chưa có file. Nhấn nút tải lên để bắt đầu.
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
                                    onToggleSelect={() => onToggleSelect(file.id)}
                                    onUpdate={(updates) => onUpdateFile(file.id, updates)}
                                    onDelete={() => onDeleteFile(file.id)}
                                    compact
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </FilesList>
            )}

            {/* Floating Actions - Show when files selected */}
            {selectedFiles.length > 0 && (
                <FloatingActions>
                    <Button
                        variant="primary"
                        icon={<Printer size={18} />}
                        onClick={onPrintSelected}
                    >
                        In ({selectedFiles.length})
                    </Button>
                    <Button variant="secondary" onClick={onDeselectAll}>
                        Bỏ chọn
                    </Button>
                </FloatingActions>
            )}
        </Container>
    );
};

export default ContractFilesMobile;
