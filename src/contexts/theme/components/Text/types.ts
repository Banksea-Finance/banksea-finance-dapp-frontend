import { LayoutProps, SpaceProps, TypographyProps } from 'styled-system'
import { Colors } from '@/contexts/theme/configs/types'
import { CSSProperties, HTMLAttributes } from 'react'
import { DefaultTheme } from 'styled-components'

export interface TextProps extends SpaceProps, LayoutProps, TypographyProps, HTMLAttributes<HTMLSpanElement | HTMLDivElement> {
  as?: 'div' | 'span'

  color?: keyof Colors | CSSProperties['color']
  fontSize?: string
  bold?: boolean
  small?: boolean
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
  important?: boolean
}

export interface ThemedProps extends TextProps {
  theme: DefaultTheme
}
