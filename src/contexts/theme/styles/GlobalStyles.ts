import { createGlobalStyle } from 'styled-components'
import { NotificationStyleMixin } from '../components/Notification'
import { FontFaces } from './FontFaces'
import { ResetDefaultStyles } from './ResetDefaultStyles'
import { ScrollBarStyles } from './ScrollBar'

export const GlobalStyles = createGlobalStyle`
  ${ResetDefaultStyles}
  ${NotificationStyleMixin}
  ${FontFaces}
  ${ScrollBarStyles}

  body {
    background: ${({ theme }) => theme.colors.background};
    font-family: 'MontserratAlternates';
  }
`
