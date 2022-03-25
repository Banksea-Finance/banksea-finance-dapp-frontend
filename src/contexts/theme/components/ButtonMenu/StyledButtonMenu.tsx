import styled, { DefaultTheme } from 'styled-components'
import { Variant } from '../Button/types'
import { getButtonMenuTheme } from './theme'
import { space } from 'styled-system'

type StyledButtonMenuProps = {
  variant: Variant
  theme: DefaultTheme
}

const getBackgroundColor = (props: StyledButtonMenuProps) => {
  return getButtonMenuTheme(props).backgroundColor
}

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  background-color: ${getBackgroundColor};
  border-radius: 40px;
  display: inline-flex;

  & > button + button,
  & > a + a {
    margin-left: 2px;
  }
  
  ${space}
`

export default StyledButtonMenu
