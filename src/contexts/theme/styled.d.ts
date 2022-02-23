import 'styled-components'
import { ThemeConfig } from './configs'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends ThemeConfig {}
}
