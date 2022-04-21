import { HTMLAttributes } from 'react'
import {
  AlignItemsProps,
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  GridProps as _GridProps,
  JustifyContentProps,
  LayoutProps,
  PositionProps,
  SpaceProps
} from 'styled-system'

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {}

export interface FlexProps extends BoxProps, FlexboxProps {
  ai?: AlignItemsProps['alignItems']
  jc?: JustifyContentProps['justifyContent']
}

export interface GridProps extends FlexProps, _GridProps {}
