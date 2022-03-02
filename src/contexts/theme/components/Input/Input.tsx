import Input from 'rc-input'
import styled, { DefaultTheme } from 'styled-components'
import { InputProps, scales } from './types'
import { layout, space } from 'styled-system'

interface StyledInputProps extends InputProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
}

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
  case scales.SM:
    return '32px'
  case scales.LG:
    return '48px'
  case scales.MD:
  default:
    return '40px'
  }
}

const StyledInput = styled(Input)<InputProps>`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.primary};
  display: block;
  font-size: 16px;
  height: ${getHeight};
  outline: 0;
  padding: 0 16px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
  
  &.rc-input-affix-wrapper {
    display: flex;
  }
  
  .rc-input {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    
    &:focus-visible {
      outline: none;
    }

    &-suffix {
      width: 16px;
      
      .rc-input-clear-icon {
        width: 8px;
      }
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  ${layout}
  ${space}
`

// StyledInput.defaultProps = {
//   scale: scales.MD,
//   isSuccess: false,
//   isWarning: false,
// }

export default StyledInput
