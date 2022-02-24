import { BaseButtonProps, Scale, variants } from '../Button/types'
import React, { HTMLAttributes } from 'react'
import { SpaceProps } from 'styled-system'

export interface ButtonMenuItemProps extends BaseButtonProps {
  isActive?: boolean
  itemKey?: string
}

export interface ButtonMenuProps extends HTMLAttributes<HTMLDivElement>, SpaceProps {
  variant?: typeof variants.PRIMARY | typeof variants.SUBTLE
  activeIndex?: number
  activeKey?: string
  onItemClick?: (args: { index: number; key?: string }) => void
  scale?: Scale
  children: React.ReactElement[]
}

export interface ButtonMenuTheme {
  width: string
  borderColor: string
  activeBackground: string
  backgroundColor: string
}
