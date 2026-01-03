import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme, $error, $focused }) =>
    $error ? theme.colors.border.error :
      $focused ? theme.colors.border.focus :
        theme.colors.border.default
  };
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[3]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[4]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[4]}`;
    }
  }};
  transition: all ${({ theme }) => theme.transition.fast};
  
  /* Adjust padding for label */
  ${({ $hasLabel, theme }) => $hasLabel && `
    padding-top: ${theme.spacing[5]};
    padding-bottom: ${theme.spacing[1]};
  `}
  
  /* Adjust padding for icons */
  ${({ $hasLeftIcon, theme }) => $hasLeftIcon && `
    padding-left: ${theme.spacing[10]};
  `}
  
  ${({ $hasRightIcon, theme }) => $hasRightIcon && `
    padding-right: ${theme.spacing[10]};
  `}
  
  &:hover:not(:disabled) {
    border-color: ${({ theme, $error }) =>
    $error ? theme.colors.border.error : theme.colors.border.hover
  };
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $error }) =>
    $error ? theme.colors.border.error : theme.colors.border.focus
  };
    box-shadow: 0 0 0 3px ${({ theme, $error }) =>
    $error ? `${theme.colors.error}20` : `${theme.colors.primary}20`
  };
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.8;
  }
`;

const Label = styled.label`
  position: ${({ $floating }) => $floating ? 'absolute' : 'static'};
  ${({ $floating, theme }) => $floating && `
    left: ${theme.spacing[4]};
    top: ${theme.spacing[2]};
    background: ${theme.colors.surface.default};
    padding: 0 ${theme.spacing[1]};
  `}
  font-size: ${({ theme, $floating, $focused, $hasValue }) =>
    $floating && ($focused || $hasValue) ? theme.typography.fontSize.xs : theme.typography.fontSize.sm
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $error, $focused }) =>
    $error ? theme.colors.error :
      $focused ? theme.colors.primary :
        theme.colors.text.secondary
  };
  transition: all ${({ theme }) => theme.transition.fast};
  pointer-events: none;
  display: block;
  margin-bottom: ${({ $floating, theme }) => $floating ? 0 : theme.spacing[2]};
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  ${({ $position }) => $position}: ${({ theme }) => theme.spacing[4]};
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const HelperText = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme, $error }) =>
    $error ? theme.colors.error : theme.colors.text.secondary
  };
`;

const Input = ({
  label,
  type = 'text',
  size = 'md',
  error,
  helperText,
  leftIcon,
  rightIcon,
  floatingLabel = true,
  value,
  onChange,
  disabled,
  required,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  return (
    <InputWrapper>
      <InputContainer>
        {label && floatingLabel && (
          <Label
            $floating={true}
            $focused={focused}
            $hasValue={hasValue}
            $error={!!error}
          >
            {label}{required && ' *'}
          </Label>
        )}

        {leftIcon && (
          <IconWrapper $position="left">
            {leftIcon}
          </IconWrapper>
        )}

        <StyledInput
          ref={inputRef}
          type={type}
          $size={size}
          $error={!!error}
          $focused={focused}
          $hasLabel={floatingLabel && !!label}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          {...props}
        />

        {rightIcon && (
          <IconWrapper $position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputContainer>

      {(error || helperText) && (
        <HelperText $error={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
};

export default Input;
