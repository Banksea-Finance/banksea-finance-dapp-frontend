import { createGlobalStyle } from 'styled-components'
import { NotificationStyleMixin } from '../components/Notification'
import ResetDefaultStyles from '@/contexts/theme/styles/ResetDefaultStyles'
import FontFaces from '@/contexts/theme/styles/FontFaces'
import ScrollBarStyles from '@/contexts/theme/styles/ScrollBar'

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
  }
  
  ${ResetDefaultStyles}
  ${NotificationStyleMixin}
  ${FontFaces}
  ${ScrollBarStyles}
`
