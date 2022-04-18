import { BaseButtonProps, variants } from '../Button/types'
import React, { HTMLAttributes } from 'react'
import { SpaceProps } from 'styled-system'
import { CSSProperties } from 'styled-components'
import { Scales } from '../../configs/scales'

export interface ButtonMenuItemProps extends BaseButtonProps {
  isActive?: boolean
  itemKey?: string
}

export interface ButtonMenuProps extends HTMLAttributes<HTMLDivElement>, SpaceProps {
  variant?: typeof variants.PRIMARY | typeof variants.SUBTLE
  activeIndex?: number
  activeKey?: string
  onItemClick?: (args: { index: number; key?: string }) => void
  scale?: Scales
  children: React.ReactElement[]
}

export interface ButtonMenuTheme {
  width: CSSProperties['width']
  borderColor: CSSProperties['color']
  activeBackground: CSSProperties['color']
  backgroundColor: CSSProperties['color']
  inactiveTextColor: CSSProperties['color']
}
