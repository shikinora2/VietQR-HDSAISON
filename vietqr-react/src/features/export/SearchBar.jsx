import React from 'react';
import styled from 'styled-components';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing['2xl']};
  padding-right: ${props => props.theme.spacing['2xl']};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.md};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background.alt};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SearchBar = ({ value, onChange, placeholder }) => {
  const [localValue, setLocalValue] = React.useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <SearchContainer>
      <SearchIcon size={18} />
      <SearchInput
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || 'Tìm kiếm...'}
      />
      {localValue && (
        <ClearButton onClick={handleClear}>
          <X size={18} />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
