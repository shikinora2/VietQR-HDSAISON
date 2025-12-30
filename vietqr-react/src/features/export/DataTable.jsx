import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from '../../components';
import { formatCurrency, formatDate } from '../../utils/formatUtils';

const TableContainer = styled(Card)`
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${props => props.theme.colors.background.alt};
  border-bottom: 2px solid ${props => props.theme.colors.border.main};
`;

const Th = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: ${props => props.sortable ? `${props.theme.colors.primary.main}10` : 'transparent'};
  }
`;

const ThContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background.alt};
  }
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary.main};
`;

const EmptyState = styled.tr`
  td {
    padding: ${props => props.theme.spacing['3xl']};
    text-align: center;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const PageInfo = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const PageButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const PageButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.main};
  background: ${props => props.active ? props.theme.colors.primary.main : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primary.dark : props.theme.colors.background.alt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DataTable = ({ data, selectedRows, onRowSelectionChange }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortField, sortDirection]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onRowSelectionChange(paginatedData.map(row => row.id));
    } else {
      onRowSelectionChange([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      onRowSelectionChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onRowSelectionChange([...selectedRows, id]);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const columns = [
    { key: 'select', label: '', sortable: false, width: '50px' },
    { key: 'contractNumber', label: 'Số HĐ', sortable: true },
    { key: 'customerName', label: 'Tên KH', sortable: true },
    { key: 'idNumber', label: 'CMND/CCCD', sortable: false },
    { key: 'phoneNumber', label: 'SĐT', sortable: false },
    { key: 'amount', label: 'Số Tiền', sortable: true },
    { key: 'effectiveDate', label: 'Ngày HL', sortable: true },
    { key: 'dueDate', label: 'Ngày ĐH', sortable: true },
  ];

  return (
    <TableContainer variant="elevated">
      <Table>
        <Thead>
          <Tr>
            {columns.map(col => (
              <Th
                key={col.key}
                sortable={col.sortable}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ width: col.width }}
              >
                {col.key === 'select' ? (
                  <Checkbox
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row.id))}
                    onChange={handleSelectAll}
                  />
                ) : (
                  <ThContent>
                    {col.label}
                    <SortIcon field={col.key} />
                  </ThContent>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.length === 0 ? (
            <EmptyState>
              <Td colSpan={columns.length}>
                Không có dữ liệu
              </Td>
            </EmptyState>
          ) : (
            paginatedData.map(row => (
              <Tr key={row.id}>
                <Td>
                  <Checkbox
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </Td>
                <Td>{row.contractNumber || '-'}</Td>
                <Td>{row.customerName || '-'}</Td>
                <Td>{row.idNumber || '-'}</Td>
                <Td>{row.phoneNumber || '-'}</Td>
                <Td>{row.amount ? formatCurrency(row.amount) : '-'}</Td>
                <Td>{row.effectiveDate ? formatDate(row.effectiveDate) : '-'}</Td>
                <Td>{row.dueDate ? formatDate(row.dueDate) : '-'}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PageInfo>
            Hiển thị {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, sortedData.length)} / {sortedData.length}
          </PageInfo>
          
          <PageButtons>
            <PageButton
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </PageButton>
            <PageButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </PageButton>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                ? totalPages - 4 + i
                : currentPage - 2 + i;
              
              if (page < 1 || page > totalPages) return null;
              
              return (
                <PageButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              );
            })}
            
            <PageButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </PageButton>
            <PageButton
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </PageButton>
          </PageButtons>
        </Pagination>
      )}
    </TableContainer>
  );
};

export default DataTable;
