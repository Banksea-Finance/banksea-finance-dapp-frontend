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

const StyledButtonMenu = styled.div<{ variant: Variant }>`
  background-color: ${getBackgroundColor};
  border-radius: 40px;
  display: inline-flex;
  border: 2px ${p => getButtonMenuTheme(p).borderColor} solid;

  & > button + button,
  & > a + a {
    margin-left: 2px; // To avoid focus shadow overlap
  }
  
  ${space}
`

export default StyledButtonMenu
