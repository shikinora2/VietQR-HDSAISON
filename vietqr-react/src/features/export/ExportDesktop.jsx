import React from 'react';
import styled from 'styled-components';
import { Button, Loading } from '../../components';
import DataTable from './DataTable';
import SearchBar from './SearchBar';
import ExportButtons from './ExportButtons';
import UploadPDFExtract from './UploadPDFExtract';

const Container = styled.div`
  width: 100%;
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
  width: auto;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

/**
 * Desktop Layout cho Export Tab
 * Full controls bar and wide DataTable
 */
const ExportDesktop = ({
    filteredData,
    selectedRows,
    searchQuery,
    isProcessing,
    progress,
    onSearch,
    onPDFUpload,
    onExportExcel,
    onExportCSV,
    onExportGoogleSheets,
    onRowSelectionChange,
}) => {
    return (
        <div style={{ minHeight: '80vh' }}></div>
    );
};

export default ExportDesktop;
