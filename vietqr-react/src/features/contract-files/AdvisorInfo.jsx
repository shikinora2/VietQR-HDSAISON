import React from 'react';
import styled from 'styled-components';
import { useLocalStorage } from '../../hooks';

const Container = styled.div`
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FormRow = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
  grid-template-columns: 1fr;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bg.input};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const AdvisorInfo = ({ onChange }) => {
    const [advisorName, setAdvisorName] = useLocalStorage('advisor_name', '');
    const [advisorPhone, setAdvisorPhone] = useLocalStorage('advisor_phone', '');

    const handleNameChange = (e) => {
        const value = e.target.value;
        setAdvisorName(value);
        if (onChange) {
            onChange({ name: value, phone: advisorPhone });
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setAdvisorPhone(value);
        if (onChange) {
            onChange({ name: advisorName, phone: value });
        }
    };

    return (
        <Container>
            <Title>Thông tin nhân viên tư vấn</Title>
            <FormRow>
                <FormGroup>
                    <Label htmlFor="advisor-name">Nhân viên tư vấn</Label>
                    <Input
                        id="advisor-name"
                        type="text"
                        value={advisorName}
                        onChange={handleNameChange}
                        placeholder="Nhập tên nhân viên tư vấn"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="advisor-phone">SĐT</Label>
                    <Input
                        id="advisor-phone"
                        type="tel"
                        value={advisorPhone}
                        onChange={handlePhoneChange}
                        placeholder="Nhập số điện thoại"
                    />
                </FormGroup>
            </FormRow>
        </Container>
    );
};

export default AdvisorInfo;
