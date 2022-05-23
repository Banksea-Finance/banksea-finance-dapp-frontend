import { InputHTMLAttributes } from 'react'

import { TextProps } from '../Text'
import { scales, Scales } from '../../types'

export const getScale = ({ scale }: CheckboxProps) => {
  switch (scale) {
  case scales.S:
    return '14px'
  case scales.M:
    return '16px'
  case scales.L:
    return '24px'
  }
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelTextStyles?: TextProps
  scale?: Scales
  type?: 'checkbox'
}
