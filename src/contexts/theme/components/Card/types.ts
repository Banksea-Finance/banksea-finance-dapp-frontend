import React, { HTMLAttributes } from 'react'
import { DisplayProps, FlexboxProps, LayoutProps, OverflowProps, SpaceProps } from 'styled-system'
import { Colors } from '../../configs/types'
import { TextProps } from '@/contexts/theme/components/Text'

export interface CardRibbonProps {
  variantColor?: keyof Colors
  text: string
  textStyle: TextProps
}

export type CardTheme = {
  background: string
  boxShadow: string
  boxShadowActive: string
  boxShadowSuccess: string
  boxShadowWarning: string
  cardHeaderBackground: string
  dropShadow: string
}

export interface CardProps
  extends DisplayProps,
    FlexboxProps,
    LayoutProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement>,
    OverflowProps {

  plain?: boolean
  isActive?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  isDisabled?: boolean
  ribbon?: React.ReactNode
  activeOnHover?: boolean
}
