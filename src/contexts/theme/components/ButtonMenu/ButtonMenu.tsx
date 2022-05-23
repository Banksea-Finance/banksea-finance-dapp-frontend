import React, { Children, cloneElement, ReactElement } from 'react'
import StyledButtonMenu from './StyledButtonMenu'
import { ButtonMenuProps } from './types'
import ButtonMenuItem from './ButtonMenuItem'
import { buttonVariant } from '../Button/types'

class ButtonMenu extends React.Component<ButtonMenuProps, any> {

  static Item = ButtonMenuItem

  render() {
    const {
      activeKey,
      activeIndex,
      scale = 'md',
      variant = buttonVariant.primary,
      onItemClick,
      style,
      children,
      ...rest
    } = this.props

    return (
      <StyledButtonMenu variant={variant} style={style} {...rest}>
        {
          Children.map(children, (child: ReactElement, index) => {
            return cloneElement(child, {
              isActive: activeIndex === index || (activeKey && child.props.itemKey as string === activeKey),
              onClick: onItemClick ? () => onItemClick({ index, key: child.props.itemKey as string }) : undefined,
              scale,
              variant,
              circle: true
            })
          })
        }
      </StyledButtonMenu>
    )
  }

}

export default ButtonMenu
