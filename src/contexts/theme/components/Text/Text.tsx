import styled, { DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import getThemeValue from '../../utils/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps) => {
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
  ${typography}
`

Text.defaultProps = {
  color: 'text',
  small: false,
}

export default Text
