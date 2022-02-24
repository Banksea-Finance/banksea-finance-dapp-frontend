import { TabsTheme } from './types'
import { DefaultTheme } from 'styled-components'
import { themes } from '@/contexts/theme'

const base: Pick<TabsTheme, 'background' | 'textColor'> = {
  background: themes.dark.colors.primaryContrary,
  textColor: '#85808d'
}

const dark: TabsTheme = {
  ...base,
  activeBackground: themes.dark.colors.primaryDark,
  activeTextColor: themes.dark.colors.text,
}

const light: TabsTheme = {
  ...base,
  activeBackground: themes.light.colors.primaryContrary,
  activeTextColor: themes.dark.colors.text,
}

export const getTabsTheme = ({ theme }: { theme: DefaultTheme}) => {
  return theme.isDark ? dark : light
}
