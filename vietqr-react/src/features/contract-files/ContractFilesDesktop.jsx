import React from 'react';
import styled from 'styled-components';
import { Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Loading } from '../../components';
import FileUploadZone from './FileUploadZone';
import ContractFileCard from './ContractFileCard';
import POSSelector from './POSSelector';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: ${props => props.theme.spacing.md};
  align-items: start;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  min-height: 400px;
  height: 100%;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${props => props.theme.spacing.sm};
  opacity: 0.3;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Desktop Layout cho ContractFiles Tab
 * 2-column grid: Controls bên trái, Files bên phải
 */
const ContractFilesDesktop = ({
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
                <Title>🖨️ In bộ hợp đồng</Title>
                <Actions>
                    <FileUploadZone onFilesUpload={onFilesUpload} variant="button" />
                    {files.length > 0 && selectedFiles.length > 0 && (
                        <>
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
                        </>
                    )}
                </Actions>
            </Header>

            <MainGrid>
                {/* Left Panel - Controls */}
                <LeftPanel>
                    <POSSelector onChange={onPosChange} />

                    {isProcessing && (
                        <div style={{
                            background: '#1E293B',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            marginTop: '8px'
                        }}>
                            <div style={{
                                color: '#FBBF24',
                                fontSize: '14px',
                                marginBottom: '8px',
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
                </LeftPanel>

                {/* Right Panel - Files */}
                <RightPanel>
                    {files.length === 0 ? (
                        <EmptyState
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <EmptyIcon>📂</EmptyIcon>
                            <EmptyText>
                                Chưa có file nào. Tải lên file PDF ở bên trái.
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
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </FilesList>
                    )}
                </RightPanel>
            </MainGrid>
        </Container>
    );
};

export default ContractFilesDesktop;
