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

  ${layout}
  ${space}
`

const InactiveButton = styled(MenuItemButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textDisabled};
  transition: background-color 0s;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-left: 20px;
    padding-right: 20px;
  }
`

const ActiveButton = styled(MenuItemButton)`
  background-color: ${p => getButtonMenuTheme(p).activeBackground};
  color: ${({ theme }) => theme.colors.text};
`

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps> = ({
  isActive = false,
  variant = variants.PRIMARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as} variant="tertiary" {...props} />
  }

  return <ActiveButton forwardedAs={as} variant={variant} {...props} />
}

export default ButtonMenuItem
