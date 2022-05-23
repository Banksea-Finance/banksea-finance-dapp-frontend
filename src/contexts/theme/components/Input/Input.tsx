import Input from 'rc-input'
import styled from 'styled-components'
import { InputProps } from './types'
import { layout, space } from 'styled-system'
import { scales } from '../../types'
import { getOverridableStyle } from '@/contexts/theme/utils'

const getBoxShadow = getOverridableStyle('Input', 'boxShadow', ({ isSuccess = false, isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
})

const getHeight = getOverridableStyle('Input', 'height', ({ scale = scales.L }) => {
  switch (scale) {
  case scales.S:
    return '32px'
  case scales.L:
    return '48px'
  case scales.M:
  default:
    return '40px'
  }
})

const getBorderRadius = getOverridableStyle('Input', 'borderRadius', () => '8px')

const getFontSize = getOverridableStyle('Input', 'fontSize', () => '16px')

const getOutline = getOverridableStyle('Input', 'outline', () => '0')

const getPadding = getOverridableStyle('Input', 'padding', () => '0 16px')

const getBorder = getOverridableStyle('Input', 'border', ({ theme }) => `1px solid ${theme.colors.primary}`)

const getColors = getOverridableStyle('Input', 'color', ({ theme }) => theme.colors.primary)

const StyledInput = styled(Input)<InputProps>`
  display: block;

  border-radius: ${getBorderRadius};
  box-shadow: ${getBoxShadow};
  border: ${getBorder};
  color: ${getColors};
  font-size: ${getFontSize};
  height: ${getHeight};
  outline: ${getOutline};
  padding: ${getPadding};

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
    flex-grow: 1;
    font-weight: 600;
    
    &:focus-visible {
      outline: none;
    }

    &-suffix {
      width: fit-content;
      display: flex;
      align-items: center;
      
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

export default StyledInput
