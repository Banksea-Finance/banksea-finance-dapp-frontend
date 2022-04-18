import { HTMLAttributes } from 'react'
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  GridProps as _GridProps, AlignItemsProps, JustifyContentProps
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
