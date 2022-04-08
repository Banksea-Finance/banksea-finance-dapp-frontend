import styled from 'styled-components'
import { layout, space, typography } from 'styled-system'
import getThemeValue from '../../utils/getThemeValue'
import { TextProps, ThemedProps } from './types'

const getColor = ({ color = 'text', theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme)
}

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '14px' : fontSize || '16px'
}

const getFontFamily = ({ important }: TextProps) => {
  return important ? 'orbitron' : ''
}

const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-family: ${getFontFamily};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.5;
  
  .primary {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space}
  ${layout}
  ${typography}
`

Text.defaultProps = {
  color: 'text',
  small: false,
  fontSize: '16px',
  fontWeight: 500
}

export default Text
