import React from 'react'
import styled from 'styled-components'
import { PolymorphicComponent, variants } from '../Button/types'
import { ButtonMenuItemProps } from './types'
import { getButtonMenuTheme } from './theme'
import { Button } from '@/contexts/theme/components'
import { layout, space } from 'styled-system'

const MenuItemButton = styled(Button)`
  width: fit-content;
  padding: 8px 40px;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  &.active {
    background-color: ${p => getButtonMenuTheme(p).activeBackground};
    color: ${({ theme }) => theme.colors.text};
    transition: all ease-out 0.58s;
  }
  
  &.inactive {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textSubtle};
    transition: all 0s;
    box-shadow: none;

    &:hover:not(:disabled):not(:active) {
      background-color: transparent;
    }
  }

  ${layout}
  ${space}
`

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps> = ({
  isActive = false,
  variant = variants.PRIMARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  return <MenuItemButton className={isActive ? 'active' : 'inactive'} forwardedAs={as} variant={variant} {...props} />
}

export default ButtonMenuItem
