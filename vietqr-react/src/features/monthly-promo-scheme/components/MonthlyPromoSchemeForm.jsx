import React from 'react';
import styled from 'styled-components';
import { Card, Input } from '../../../components';
import { formatCurrency } from '../../../utils/formatUtils';
import {
  MONTHLY_PROMO_PROGRAM_OPTIONS,
  MONTHLY_PROMO_CUSTOMER_TYPE_OPTIONS,
  MONTHLY_PROMO_LOAN_TERM_OPTIONS,
} from '../constants';

const StyledCard = styled(Card)`
  padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};

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

const AlwaysTwoColumnGroup = styled(InputGroup)`
  grid-template-columns: 1fr 1fr;
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
    min-height: 44px;
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

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.$compact ? props.theme.spacing.xs : props.theme.spacing.md};
  flex-wrap: wrap;
`;

const RadioOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  cursor: pointer;
  border: 1px solid ${props => props.$checked ? props.theme.colors.primary.main : props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.$compact ? '6px 10px' : '8px 12px'};
  background: ${props => props.$checked ? props.theme.colors.primary.light + '22' : props.theme.colors.surface.default};
  font-size: ${props => props.$compact ? props.theme.typography.fontSize.xs : props.theme.typography.fontSize.sm};
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  accent-color: ${props => props.theme.colors.primary.main};
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

  > div {
    width: 100%;
  }

  label {
    display: none;
  }
`;

const MonthlyPromoSchemeForm = ({ formData, onChange, compact = false }) => {
  const isDlProgram = formData.loanProgram === 'dl';

  const handlePriceChange = (value) => {
    const numericValue = Number(value.replace(/\D/g, ''));

    if (isDlProgram) {
      onChange({ productPrice: numericValue });
      return;
    }

    if (formData.downPaymentPercent > 0) {
      const amount = Math.round(numericValue * (formData.downPaymentPercent / 100));
      onChange({
        productPrice: numericValue,
        downPaymentAmount: amount,
      });
      return;
    }

    onChange({ productPrice: numericValue });
  };

  const handleDownPaymentPercentChange = (value) => {
    if (isDlProgram) return;

    let percent = parseFloat(value);
    if (Number.isNaN(percent)) percent = 0;
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    if (formData.productPrice > 0) {
      const amount = Math.round(formData.productPrice * (percent / 100));
      onChange({
        downPaymentPercent: percent,
        downPaymentAmount: amount,
      });
      return;
    }

    onChange({ downPaymentPercent: percent });
  };

  const handleDownPaymentAmountChange = (value) => {
    if (isDlProgram) return;

    const amount = Number(value.replace(/\D/g, ''));
    const percent = formData.productPrice > 0
      ? (amount / formData.productPrice) * 100
      : 0;

    onChange({
      downPaymentAmount: amount,
      downPaymentPercent: percent,
    });
  };

  return (
    <StyledCard variant="glass" $compact={compact}>
      <FormTitle $compact={compact}>Thông Tin Scheme Khuyến Mãi</FormTitle>

      <FormGrid $compact={compact}>
        <InputGroup $compact={compact}>
          <div>
            <Label $compact={compact}>
              {isDlProgram
                ? (compact ? 'Tiền vay (VND)' : 'Số tiền vay (VND)')
                : (compact ? 'Giá SP (VND)' : 'Giá sản phẩm (VND)')}
            </Label>
            <Input
              placeholder={isDlProgram ? 'Nhập số tiền vay' : 'Nhập giá bán'}
              value={formData.productPrice ? formatCurrency(formData.productPrice, false) : ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              inputMode="numeric"
              type="text"
            />
          </div>

          <div>
            <Label $compact={compact}>{compact ? 'CT' : 'Chương trình'}</Label>
            <Select
              value={formData.loanProgram}
              onChange={(e) => {
                const nextProgram = e.target.value;
                if (nextProgram === 'dl') {
                  onChange({
                    loanProgram: nextProgram,
                    downPaymentPercent: 0,
                    downPaymentAmount: 0,
                  });
                  return;
                }

                onChange({ loanProgram: nextProgram });
              }}
            >
              {MONTHLY_PROMO_PROGRAM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        </InputGroup>

        <div>
          <Label $compact={compact}>Phân loại khách hàng</Label>
          <RadioGroup $compact={compact}>
            {MONTHLY_PROMO_CUSTOMER_TYPE_OPTIONS.map((option) => (
              <RadioOption
                key={option.value}
                $checked={formData.customerType === option.value}
                $compact={compact}
              >
                <RadioInput
                  name="monthly-promo-customer-type"
                  checked={formData.customerType === option.value}
                  onChange={() => onChange({ customerType: option.value })}
                />
                <span>{option.label}</span>
              </RadioOption>
            ))}
          </RadioGroup>
        </div>

        <AlwaysTwoColumnGroup $compact={compact}>
          <div>
            <Label $compact={compact}>{compact ? 'TT trước (%)' : 'Phần trăm trả trước (%)'}</Label>
            <PercentInput
              placeholder="Nhập %"
              value={formData.downPaymentPercent > 0 ? formData.downPaymentPercent : ''}
              onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
              inputMode="decimal"
              type="text"
              disabled={isDlProgram}
            />
          </div>

          <div>
            <Label $compact={compact}>{compact ? 'Số tiền TT (VND)' : 'Số tiền trả trước (VND)'}</Label>
            <AmountInput>
              <Input
                placeholder="Hoặc nhập số tiền"
                value={formData.downPaymentAmount > 0 ? formatCurrency(formData.downPaymentAmount, false) : ''}
                onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                inputMode="numeric"
                disabled={isDlProgram}
              />
            </AmountInput>
          </div>
        </AlwaysTwoColumnGroup>

        {!compact && !isDlProgram && (
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

        <InputGroup $compact={compact}>
          <div>
            <Label $compact={compact}>{compact ? 'Kỳ hạn (tháng)' : 'Kỳ hạn vay (tháng)'}</Label>
            <Select
              value={formData.loanTerm}
              onChange={(e) => onChange({ loanTerm: Number(e.target.value) })}
            >
              {MONTHLY_PROMO_LOAN_TERM_OPTIONS.map((term) => (
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
              <span>BHKV</span>
            </CheckboxContainer>
          </div>
        </InputGroup>
      </FormGrid>
    </StyledCard>
  );
};

export default MonthlyPromoSchemeForm;
