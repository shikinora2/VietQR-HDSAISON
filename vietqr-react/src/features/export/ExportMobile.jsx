import React from 'react';
import styled from 'styled-components';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button, Loading } from '../../components';
import SearchBar from './SearchBar';
import UploadPDFExtract from './UploadPDFExtract';

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
  background: ${props => props.theme.colors.surface.default};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.sm};
  gap: ${props => props.theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const ExportActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const DataCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const DataCard = styled.div`
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  
  ${props => props.$selected && `
    border-color: ${props.theme.colors.primary.main};
    background: ${props.theme.colors.primary.main}10;
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ContractNumber = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const CustomerName = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Mobile Layout cho Export Tab
 * Card-based layout thay vì table
 */
const ExportMobile = ({
    filteredData,
    selectedRows,
    searchQuery,
    isProcessing,
    progress,
    onSearch,
    onPDFUpload,
    onExportExcel,
    onExportCSV,
    onRowSelectionChange,
}) => {
    const toggleRow = (id) => {
        const newSelection = selectedRows.includes(id)
            ? selectedRows.filter(r => r !== id)
            : [...selectedRows, id];
        onRowSelectionChange(newSelection);
    };

    return (
        <div style={{ minHeight: '80vh' }}></div>
    );
};

export default ExportMobile;
