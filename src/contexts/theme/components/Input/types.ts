import { LayoutProps, SpaceProps } from 'styled-system'
import { PickCSSProperties, Scales } from '../../types'
import { DefaultTheme } from 'styled-components'

export interface InputProps extends SpaceProps, LayoutProps {
  scale?: Scales
  isSuccess?: boolean
  isWarning?: boolean
}

export interface StyledInputProps extends InputProps {
  theme: DefaultTheme
}

export type InputOverridableCSSProperties = PickCSSProperties<
  'boxShadow' | 'height' | 'border' | 'color' | 'fontSize' | 'outline' | 'padding' | 'borderRadius'
>
