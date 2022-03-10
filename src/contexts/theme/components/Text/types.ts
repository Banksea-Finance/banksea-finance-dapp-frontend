import { SpaceProps, TypographyProps } from 'styled-system'
import { Colors } from '@/contexts/theme/configs/types'
import { CSSProperties, HTMLAttributes } from 'react'

export interface TextProps extends SpaceProps, TypographyProps, HTMLAttributes<HTMLDivElement> {
  color?: keyof Colors | CSSProperties['color']
  fontSize?: string
  bold?: boolean
  small?: boolean
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
  important?: boolean
}
