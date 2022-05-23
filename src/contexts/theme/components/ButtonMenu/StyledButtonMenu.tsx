import styled from 'styled-components'
import { space } from 'styled-system'
import { StyledButtonMenuProps } from './types'
import { getOverridableStyle } from '../../utils'

const getBackgroundColor = getOverridableStyle('ButtonMenu', 'backgroundColor', () => 'transparent')

const getPadding = getOverridableStyle('ButtonMenu', 'padding', () => '4px')

const getBorderRadius = getOverridableStyle('ButtonMenu', 'borderRadius', () => '40px')

const getBorder = getOverridableStyle('ButtonMenu', 'border', ({ theme }) => `1px solid ${theme.colors.primary}`)

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  background-color: ${getBackgroundColor};
  border: ${getBorder};
  padding: ${getPadding};
  border-radius: ${getBorderRadius};
  
  display: inline-flex;

  & > button + button,
  & > a + a {
    margin-left: 2px;
  }

  ${space}
`

export default StyledButtonMenu
