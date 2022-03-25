import { Props as RcCheckboxProps } from 'rc-checkbox'

export const scales = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md'
} as const

export type Scales = typeof scales[keyof typeof scales];

export interface CheckboxProps extends RcCheckboxProps{
  scale?: Scales;
}
