import React, { useCallback, useContext, useMemo, useState } from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import { themes } from './theme'
import useLocalStorage from '@/hooks/useLocalStorage'
import { ComponentStylesOverride, ThemeType } from './theme/types'

export const THEME_STORAGE_KEY = 'theme'

const ThemeWrapperContext = React.createContext({
  themeType: 'light',
  themeInstance: themes.light,
  switchTheme: () => {}
})

const ThemeWrapperProvider: React.FC<{ componentsOverride?: ComponentStylesOverride }> = ({ children, componentsOverride }) => {
  const [storedThemeType, setStoredTheme] = useLocalStorage<ThemeType>(THEME_STORAGE_KEY, 'dark')

  const [themeType, setThemeType] = useState<ThemeType>(storedThemeType as ThemeType)

  const switchTheme = useCallback(() => {
    if (themeType === 'light') {
      setThemeType('dark')
      setStoredTheme('dark')
    } else {
      setThemeType('light')
      setStoredTheme('light')
    }
  }, [themeType])

  const activeTheme: DefaultTheme = useMemo(() => ({
    ...themes[themeType as ThemeType],
    componentStylesOverride: componentsOverride || {}
  }), [themeType])

  return (
    <ThemeWrapperContext.Provider
      value={{
        themeType,
        themeInstance: activeTheme,
        switchTheme
      }}
    >
      <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>
    </ThemeWrapperContext.Provider>
  )
}

const useThemeWrapper = () => {
  const { themeType, themeInstance, switchTheme } = useContext(ThemeWrapperContext)

  return {
    themeType,
    themeInstance,
    switchTheme
  }
}

export { ThemeWrapperProvider, useThemeWrapper }
