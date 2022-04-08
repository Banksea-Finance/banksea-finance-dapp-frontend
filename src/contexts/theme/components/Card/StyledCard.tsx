import styled, { DefaultTheme } from 'styled-components'
import { display, flexbox, layout, overflow, space } from 'styled-system'
import { CardProps } from './types'
import { getCardTheme } from './theme'
import getThemeValue from '@/contexts/theme/utils/getThemeValue'

interface StyledCardProps extends CardProps {
  theme: DefaultTheme
}

/**
 * Priority: Plain --> Warning --> Success --> Active
 */
const getBoxShadow = ({ plain, isActive, isSuccess, isWarning, theme }: StyledCardProps) => {
  const cardTheme = getCardTheme({ theme })

  if (plain) {
    return ''
  }

  if (isWarning) {
    return cardTheme.boxShadowWarning
  }

  if (isSuccess) {
    return cardTheme.boxShadowSuccess
  }

  if (isActive) {
    return cardTheme.boxShadowActive
  }

  return cardTheme.boxShadow
}

const getBackgroundColor = ({ backgroundColor, theme }: StyledCardProps) => {
  return getThemeValue(`colors.${backgroundColor}`, getCardTheme({ theme }).background)(theme)
}

const StyledCard = styled.div<StyledCardProps>`
  display: flex;
  ${flexbox};

  background-color: ${getBackgroundColor};
  border: ${p => getCardTheme(p).boxShadow};
  border-radius: 32px;
  box-shadow: ${getBoxShadow};
  overflow: hidden;
  position: relative;
  transition: all 0.28s;

  ${props => props.activeOnHover && `
    &:hover {
      box-shadow: ${getCardTheme(props).boxShadowActive};
    }  
  `}

  ${space}
  ${layout}
  ${display}
  ${overflow}
`

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false
}

export default StyledCard
