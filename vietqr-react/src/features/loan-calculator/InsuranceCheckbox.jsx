import React from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => 
    props.checked ? props.theme.colors.primary.main : props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => 
    props.checked ? props.theme.colors.primary.main : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
  }

  svg {
    opacity: ${props => props.checked ? 1 : 0};
    color: white;
    transition: opacity 0.2s ease;
  }
`;

const LabelText = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const RateInput = styled.div`
  margin-left: 32px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.md};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}20;
  }
`;

const InputLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const InsuranceCheckbox = ({ isChecked, rate, onChange }) => {
  const handleCheckboxChange = () => {
    onChange(!isChecked, rate || 1.5);
  };

  const handleRateChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    onChange(isChecked, Number(value));
  };

  return (
    <Container>
      <CheckboxLabel>
        <HiddenCheckbox
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <StyledCheckbox checked={isChecked}>
          <Check size={16} />
        </StyledCheckbox>
        <LabelText>Bao gồm Phí Bảo Hiểm</LabelText>
      </CheckboxLabel>

      {isChecked && (
        <RateInput>
          <InputLabel>Phí BH:</InputLabel>
          <Input
            type="text"
            value={rate || ''}
            onChange={handleRateChange}
            placeholder="1.5"
          />
          <InputLabel>%/năm</InputLabel>
        </RateInput>
      )}
    </Container>
  );
};

export default InsuranceCheckbox;
