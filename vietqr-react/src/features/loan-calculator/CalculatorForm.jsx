import React from 'react';
import styled from 'styled-components';
import { Card, Input, Button } from '../../components';
import { formatCurrency } from '../../utils/formatUtils';

const StyledCard = styled(Card)`
  padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.xl};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};
    
    /* Target nested inputs for mobile 44px touch target */
    input {
      min-height: ${props => props.$compact ? '38px' : '44px'};
      font-size: ${props => props.$compact ? '14px' : '16px'};
    }
  }
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  ${props => props.$compact && `
    display: none;
  `}
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${props => props.$compact ? props.theme.spacing.xs : props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.$compact ? props.theme.spacing.xs : props.theme.spacing.md};
  }
`;

const InputGroup = styled.div`
  display: grid;
  gap: ${props => props.$compact ? props.theme.spacing.xs : props.theme.spacing.md};
  grid-template-columns: ${props => props.$compact ? '1fr 1fr' : '1fr'};

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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 44px; /* Ensure 44px on mobile */
    font-size: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.$compact ? '2px' : props.theme.spacing.xs};
  font-size: ${props => props.$compact ? '11px' : props.theme.typography.fontSize.sm};
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
  opacity: 0.5;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
    opacity: 0.7;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1.25em;
  height: 1.25em;
  accent-color: ${props => props.theme.colors.primary.main};
`;


const PercentInput = styled(Input)`
  width: 100%;
  flex-shrink: 0;
  
  /* Remove the default Input label styling since we use parent Label */
  label {
    display: none;
  }
  
  input {
    text-align: center;
  }
`;

const AmountInput = styled.div`
  flex: 1;
  display: flex;
  
  /* Ensure inner input wrapper fills width */
  > div {
    width: 100%;
  }
  
  /* Remove the default Input label styling since we use parent Label */
  label {
    display: none;
  }
`;

const CalculatorForm = ({ formData, onChange, compact }) => {
  const handlePriceChange = (value) => {
    const numericValue = Number(value.replace(/\D/g, ''));

    // Auto calculate down payment amount if percent exists
    if (formData.downPaymentPercent > 0) {
      const amount = Math.round(numericValue * (formData.downPaymentPercent / 100));
      onChange({
        productPrice: numericValue,
        downPaymentAmount: amount
      });
    } else {
      onChange({ productPrice: numericValue });
    }
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
    <StyledCard variant="glass" $compact={compact}>
      <FormTitle $compact={compact}>Thông Tin Khoản Vay (HD SAISON)</FormTitle>

      <FormGrid $compact={compact}>
        {/* Row 1: Giá sản phẩm + Chương trình vay */}
        <InputGroup $compact={compact}>
          <div>
            <Label $compact={compact}>{compact ? 'Giá SP (VNĐ)' : 'Giá sản phẩm (VNĐ)'}</Label>
            <Input
              placeholder="Nhập giá bán"
              value={formData.productPrice ? formatCurrency(formData.productPrice, false) : ''}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
          </div>

          <div>
            <Label $compact={compact}>{compact ? 'CT vay' : 'Chương trình vay'}</Label>
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

        {/* Row 2: Trả trước */}
        <InputGroup $compact={compact}>
          <div>
            <Label $compact={compact}>{compact ? 'TT trước (%)' : 'Phần trăm trả trước (%)'}</Label>
            <PercentInput
              placeholder="Nhập %"
              value={formData.downPaymentPercent > 0 ? formData.downPaymentPercent : ''}
              onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <div>
            <Label $compact={compact}>{compact ? 'Số tiền TT (VNĐ)' : 'Số tiền trả trước (VNĐ)'}</Label>
            <AmountInput>
              <Input
                placeholder="Hoặc nhập số tiền"
                value={formData.downPaymentAmount > 0 ? formatCurrency(formData.downPaymentAmount, false) : ''}
                onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                inputMode="numeric"
              />
            </AmountInput>
          </div>
        </InputGroup>

        {/* Row 3: Số tiền vay (readonly) - ẩn khi compact */}
        {!compact && (
          <InputGroup>
            <div>
              <Label>Số tiền vay</Label>
              <Input
                placeholder="Tự động tính"
                value={formData.productPrice > 0 && formData.productPrice >= formData.downPaymentAmount
                  ? formatCurrency(formData.productPrice - formData.downPaymentAmount, false)
                  : ''}
                disabled
                readOnly
              />
            </div>
          </InputGroup>
        )}

        {/* Row 4: Kỳ hạn vay + Bảo hiểm */}
        <InputGroup $compact={compact}>
          <div>
            <Label $compact={compact}>{compact ? 'Kỳ hạn (tháng)' : 'Kỳ hạn vay (tháng)'}</Label>
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
