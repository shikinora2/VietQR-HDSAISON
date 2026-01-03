import React from 'react';
import styled from 'styled-components';
import { useLocalStorage } from '../../hooks';

// POS Info matching HTML legacy
const POS_INFO = {
  "POS24414": {
    address: "Số 5 Lý Thường Kiệt, KP. Thắng Lợi 1, P. Dĩ An, TP. Dĩ An, Bình Dương",
    templateUrl: 'https://rawcdn.githack.com/shikinora2/VietQR-HDSAISON/e77ada21e72f381e5d8aaa2aecc7b9851fece42d/PDK0IR%20-%20DMCL%20(2).pdf'
  },
  "POS13858": {
    address: "5A/2, Đường DT743, KP.1B, P. An Phú, Thuận An, Bình Dương",
    templateUrl: 'https://rawcdn.githack.com/shikinora2/VietQR-HDSAISON/e77ada21e72f381e5d8aaa2aecc7b9851fece42d/PDK0IR%20-%20DMCL%2013858.pdf'
  }
};

const Container = styled.div`
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.surface.default};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background-color: ${props => props.theme.colors.surface.default};
    color: ${props => props.theme.colors.text.primary};
    padding: ${props => props.theme.spacing.sm};
  }
`;

const Address = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
  margin-bottom: 0;
  line-height: 1.5;
`;

const POSSelector = ({ onChange }) => {
  const [selectedPOS, setSelectedPOS] = useLocalStorage('selectedPos', 'POS24414');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedPOS(value);
    if (onChange) {
      onChange(value, POS_INFO[value]);
    }
  };

  const currentPOS = POS_INFO[selectedPOS];

  return (
    <Container>
      <Label htmlFor="pos-select">Chọn POS</Label>
      <Select
        id="pos-select"
        value={selectedPOS}
        onChange={handleChange}
      >
        {Object.keys(POS_INFO).map(posId => (
          <option key={posId} value={posId}>{posId}</option>
        ))}
      </Select>
      {currentPOS && (
        <Address>{currentPOS.address}</Address>
      )}
    </Container>
  );
};

export { POSSelector, POS_INFO };
export default POSSelector;
