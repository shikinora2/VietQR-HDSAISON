/**
 * DL Bonus Calculator - Shared Styled Components
 * Theme: Glassmorphism Dark (matching existing app theme)
 */

import styled from 'styled-components';

// ============================================
// Container & Layout
// ============================================

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

export const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

// ============================================
// Section Components
// ============================================

export const Section = styled.div`
  background: transparent;
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: #3b82f6;
  margin: 0;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
`;

// ============================================
// Table Components
// ============================================

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

export const TableHeader = styled.th`
  background: rgba(30, 41, 59, 0.6);
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  text-align: center;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.md};
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  text-align: center;
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.primary};
`;

export const InputCell = styled(TableCell)`
  background: transparent;
  color: ${props => props.theme.colors.text.primary};
  
  input {
    width: 100%;
    background: transparent;
    border: none;
    text-align: center;
    font-size: inherit;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.text.primary};
    outline: none;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.secondary};
    }
  }
`;

export const ResultCell = styled(TableCell)`
  background: ${props => props.$highlight
    ? 'rgba(34, 197, 94, 0.3)'
    : 'transparent'};
  color: ${props => props.$highlight ? '#22c55e' : props.theme.colors.text.primary};
  font-weight: ${props => props.$highlight
    ? props.theme.typography.fontWeight.bold
    : props.theme.typography.fontWeight.medium};
`;

export const HighlightCell = styled(TableCell)`
  background: rgba(34, 197, 94, 0.3);
  color: #22c55e;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

// ============================================
// Single Value Box (for Hệ số đạt chỉ tiêu)
// ============================================

export const ValueBox = styled.div`
  display: inline-block;
  background: transparent;
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
`;

export const ValueLabel = styled.div`
  background: rgba(30, 41, 59, 0.6);
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  display: inline-block;
  margin-left: ${props => props.theme.spacing.sm};
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.md};
`;

// ============================================
// Layout Helpers
// ============================================

export const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// ============================================
// Main Result Card (TỔNG THƯỞNG - Trọng tâm)
// ============================================

export const MainResultCard = styled.div`
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid rgba(34, 197, 94, 0.4);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  margin: ${props => props.theme.spacing.sm} 0;
`;

export const MainResultLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: #22c55e;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const MainResultValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl'] || '1.75rem'};
  color: #22c55e;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

// ============================================
// Detail Cards (Chi tiết thưởng - 3 cards nhỏ)
// ============================================

export const DetailCardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailCard = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  text-align: center;
`;

export const DetailCardLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const DetailCardValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

// ============================================
// Input Grid (2 hàng layout cho inputs)
// ============================================

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InputItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export const InputLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

export const InputField = styled.input`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  outline: none;
  
  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

// ============================================
// Key-Value Pairs (Chi tiết tính toán)
// ============================================

export const KeyValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.xs};
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const KeyValueItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: rgba(30, 41, 59, 0.3);
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid rgba(248, 250, 252, 0.08);
`;

export const KeyLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

export const KeyValue = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

// ============================================
// Contracts Table (Chi tiết hợp đồng)
// ============================================

export const ContractsTableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: ${props => props.theme.spacing.sm};
`;

export const ContractsTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 2px;
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

export const ContractsTh = styled.th`
  background: rgba(30, 41, 59, 0.6);
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.xs};
  text-align: center;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: ${props => props.theme.borderRadius.sm};
  white-space: nowrap;
  font-size: 10px;
`;

export const ContractsTd = styled.td`
  padding: 2px;
  text-align: center;
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.$highlight ? 'rgba(34, 197, 94, 0.15)' : 'transparent'};
`;

export const ContractInput = styled.input`
  width: 100%;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 4px 6px;
  font-size: 11px;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  outline: none;
  
  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(30, 41, 59, 0.5);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
    opacity: 0.5;
  }
`;

export const ContractSelect = styled.select`
  width: 100%;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 4px 6px;
  font-size: 11px;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
  }
  
  option {
    background: #1e293b;
  }
`;

export const ContractResultCell = styled.span`
  display: block;
  padding: 4px;
  font-size: 11px;
  color: ${props => props.$highlight ? '#22c55e' : props.theme.colors.text.primary};
  font-weight: ${props => props.$highlight ? 600 : 400};
`;

export const TableActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  justify-content: flex-start;
  align-items: center;
`;

export const AddRowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: 11px;
  color: #60a5fa;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(59, 130, 246, 0.3);
  }
`;

export const DeleteRowButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 2px 6px;
  font-size: 10px;
  color: #f87171;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(239, 68, 68, 0.4);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
`;
