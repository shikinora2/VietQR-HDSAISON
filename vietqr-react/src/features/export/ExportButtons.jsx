import React from 'react';
import styled from 'styled-components';
import { Download, FileSpreadsheet, Share2 } from 'lucide-react';
import { Button, Dropdown } from '../../components';

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const Badge = styled.span`
  background: ${props => props.theme.colors.primary.main};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-left: ${props => props.theme.spacing.xs};
`;

const ExportButtons = ({
  onExportExcel,
  onExportCSV,
  onExportGoogleSheets,
  selectedCount,
  totalCount,
}) => {
  const exportItems = [
    {
      label: 'Xuất Excel (.xlsx)',
      icon: <FileSpreadsheet size={16} />,
      onClick: onExportExcel,
    },
    {
      label: 'Xuất CSV (.csv)',
      icon: <Download size={16} />,
      onClick: onExportCSV,
    },
    {
      type: 'divider',
    },
    {
      label: 'Xuất Google Sheets',
      icon: <Share2 size={16} />,
      onClick: onExportGoogleSheets,
    },
  ];

  return (
    <ButtonsContainer>
      <Dropdown items={exportItems} placement="bottom-end">
        <Button variant="primary" icon={<Download size={18} />}>
          Xuất Dữ Liệu
          {selectedCount > 0 && <Badge>{selectedCount}</Badge>}
        </Button>
      </Dropdown>

      {selectedCount > 0 && (
        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          Đã chọn {selectedCount}/{totalCount}
        </span>
      )}
    </ButtonsContainer>
  );
};

export default ExportButtons;
