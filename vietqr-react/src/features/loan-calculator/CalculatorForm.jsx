import React from 'react';
import styled from 'styled-components';
import { Card, Input, Button } from '../../components';
import { formatCurrency } from '../../utils/formatUtils';

const StyledCard = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
  grid-template-columns: 1fr;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.light}50;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  user-select: none;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.isChecked ? props.theme.colors.primary.main : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1.25em;
  height: 1.25em;
  accent-color: ${props => props.theme.colors.primary.main};
`;

const CalculatorForm = ({ formData, onChange }) => {
  const handlePriceChange = (value) => {
    const numericValue = Number(value.replace(/\D/g, ''));
    onChange({ productPrice: numericValue });
  };

  const handleDownPaymentChange = (value) => {
    const numericValue = Number(value.replace(/\D/g, ''));
    onChange({ downPaymentAmount: numericValue });
  };

  const handleDownPaymentPercentChange = (value) => {
    let percent = parseFloat(value);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    // Auto calculate amount based on percent
    if (formData.productPrice > 0) {
      const amount = Math.round(formData.productPrice * (percent / 100));
      onChange({
        downPaymentPercent: percent,
        downPaymentAmount: amount
      });
    } else {
      onChange({ downPaymentPercent: percent });
    }
  };

  // Recalculate percent when amount changes
  const handleDownPaymentAmountChange = (value) => {
    const amount = Number(value.replace(/\D/g, ''));
    let percent = 0;
    if (formData.productPrice > 0) {
      percent = (amount / formData.productPrice) * 100;
    }
    onChange({
      downPaymentAmount: amount,
      downPaymentPercent: percent
    });
  };

  return (
    <StyledCard variant="elevated">
      <FormTitle>Thông Tin Khoản Vay (HD SAISON)</FormTitle>

      <FormGrid>
        <InputGroup>
          <Input
            label="Giá sản phẩm (VNĐ)"
            placeholder="Nhập giá bán"
            value={formData.productPrice ? formatCurrency(formData.productPrice) : ''}
            onChange={(e) => handlePriceChange(e.target.value)}
          />

          <div>
            <Label>Chương trình vay</Label>
            <Select
              value={formData.loanProgram}
              onChange={(e) => onChange({ loanProgram: e.target.value })}
            >
              <option value="0">Lãi suất 0%</option>
              <option value="0.005">Lãi suất 0.5%</option>
              <option value="0.01">Lãi suất 1%</option>
              <option value="regular">Lãi thường</option>
            </Select>
          </div>
        </InputGroup>

        <InputGroup>
          <Input
            label="Trả trước (VNĐ)"
            placeholder="Số tiền trả trước"
            value={formData.downPaymentAmount ? formatCurrency(formData.downPaymentAmount) : ''}
            onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
          />

          <Input
            label="% Trả trước"
            placeholder="Nhập %"
            type="number"
            value={formData.downPaymentPercent ? Math.round(formData.downPaymentPercent) : ''}
            onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <div>
            <Label>ky hạn vay (tháng)</Label>
            <Select
              value={formData.loanTerm}
              onChange={(e) => onChange({ loanTerm: Number(e.target.value) })}
            >
              {[6, 9, 12, 15, 18, 24].map(term => (
                <option key={term} value={term}>{term} tháng</option>
              ))}
            </Select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '2px' }}>
            <CheckboxContainer isChecked={formData.includeInsurance}>
              <HiddenCheckbox
                checked={formData.includeInsurance}
                onChange={(e) => onChange({ includeInsurance: e.target.checked })}
              />
              <span>Có bảo hiểm khoản vay (5%)</span>
            </CheckboxContainer>
          </div>
        </InputGroup>
      </FormGrid>
    </StyledCard>
  );
};

export default CalculatorForm;
