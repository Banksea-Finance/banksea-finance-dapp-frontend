import { Breakpoints, Colors, MediaQueries, Radii, Shadows, Spacing, ZIndices } from './types'

import lightTheme from './light'
import darkTheme from './dark'
import { DefaultTheme } from 'styled-components'

export type ThemeType = 'light' | 'dark'

export interface ThemeConfig {
  name: string
  siteWidth: string
  navbarHeight: string
  mobileNavbarHeight: string
  isDark: boolean
  colors: Colors
  breakpoints: Breakpoints
  mediaQueries: MediaQueries
  spacing: Spacing
  shadows: Shadows
  radii: Radii
  zIndices: ZIndices
}

export { default as dark } from './dark'
export { default as light } from './light'

export { lightColors } from './colors'
export { darkColors } from './colors'

export const themes: Record<ThemeType, DefaultTheme> = {
  light: lightTheme,
  dark: darkTheme
}
