import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../components';
import { formatCurrency } from '../../utils/formatUtils';

const Container = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
  display: block;
`;

const SliderContainer = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => `linear-gradient(
    to right,
    ${props.theme.colors.primary.main} 0%,
    ${props.theme.colors.primary.main} ${props.value}%,
    ${props.theme.colors.border.main} ${props.value}%,
    ${props.theme.colors.border.main} 100%
  )`};
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary.main};
    cursor: pointer;
    box-shadow: ${props => props.theme.shadows.sm};
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: ${props => props.theme.shadows.md};
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary.main};
    cursor: pointer;
    border: none;
    box-shadow: ${props => props.theme.shadows.sm};
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: ${props => props.theme.shadows.md};
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${props => props.theme.spacing.sm};
  align-items: end;
`;

const PercentDisplay = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary.main}20;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary.main};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  min-width: 80px;
  text-align: center;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DownPaymentControl = ({
  loanAmount,
  downPaymentAmount,
  downPaymentPercent,
  onChange,
}) => {
  const [localAmount, setLocalAmount] = useState(downPaymentAmount);
  const [localPercent, setLocalPercent] = useState(downPaymentPercent);

  useEffect(() => {
    setLocalAmount(downPaymentAmount);
    setLocalPercent(downPaymentPercent);
  }, [downPaymentAmount, downPaymentPercent]);

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const amount = Number(numericValue);
    
    setLocalAmount(amount);

    if (loanAmount > 0) {
      const percent = Math.min(100, (amount / loanAmount) * 100);
      setLocalPercent(percent);
      onChange(amount, percent);
    } else {
      onChange(amount, 0);
    }
  };

  const handlePercentChange = (value) => {
    const percent = Number(value);
    setLocalPercent(percent);

    if (loanAmount > 0) {
      const amount = Math.round((loanAmount * percent) / 100);
      setLocalAmount(amount);
      onChange(amount, percent);
    } else {
      onChange(0, percent);
    }
  };

  return (
    <Container>
      <Label>Trả trước (Down Payment)</Label>

      <InputRow>
        <Input
          placeholder="Nhập số tiền trả trước"
          value={localAmount ? formatCurrency(localAmount) : ''}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
        <PercentDisplay>{localPercent.toFixed(0)}%</PercentDisplay>
      </InputRow>

      <SliderContainer>
        <Slider
          type="range"
          min="0"
          max="100"
          step="1"
          value={localPercent}
          onChange={(e) => handlePercentChange(e.target.value)}
        />
        <SliderLabels>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </SliderLabels>
      </SliderContainer>
    </Container>
  );
};

export default DownPaymentControl;
