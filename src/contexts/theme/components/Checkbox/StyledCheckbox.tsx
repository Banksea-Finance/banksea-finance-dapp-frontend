import styled from 'styled-components'
import { scales } from '../../configs/scales'
import { CheckboxProps, getScale } from './types'

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })<CheckboxProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};

  &:after {
    content: '';
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: transparent;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.success};

    &:after {
      border-color: white;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

StyledCheckbox.defaultProps = {
  scale: scales.M,
}

export default StyledCheckbox
