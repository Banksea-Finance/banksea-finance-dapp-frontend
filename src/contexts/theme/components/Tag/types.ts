import { ReactNode } from 'react'
import { SpaceProps, TypographyProps } from 'styled-system'
import { Scales } from '../../configs/scales'

export const variants = {
  PRIMARY: 'primary',
  PRIMARY_CONTRARY: 'primaryContrary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  TEXTDISABLED: 'textDisabled',
  TEXTSUBTLE: 'textSubtle',
  FAILURE: 'failure',
  WARNING: 'warning'
} as const

export type Variant = typeof variants[keyof typeof variants];

export interface TagProps extends SpaceProps, TypographyProps {
  variant?: Variant;
  scale?: Scales;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  outline?: boolean;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}
