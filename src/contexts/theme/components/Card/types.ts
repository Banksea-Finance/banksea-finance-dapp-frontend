import React, { HTMLAttributes } from 'react'
import { DisplayProps, FlexboxProps, LayoutProps, SpaceProps } from 'styled-system'
import { Colors } from '../../configs/types'

export interface CardRibbonProps {
  variantColor?: keyof Colors
  text: string
}

export type CardTheme = {
  background: string;
  boxShadow: string;
  boxShadowActive: string;
  boxShadowSuccess: string;
  boxShadowWarning: string;
  cardHeaderBackground: string;
  dropShadow: string;
};

export interface CardProps extends DisplayProps, FlexboxProps, LayoutProps, SpaceProps, HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  isDisabled?: boolean;
  ribbon?: React.ReactNode;
}
