import React, { cloneElement, ElementType, isValidElement } from 'react'
import getExternalLinkProps from '../../utils/getExternalLinkProps'
import StyledButton from './StyledButton'
import { ButtonProps, variants } from './types'
import { DotLoader } from 'react-spinners'
import { useResponsive } from '@/contexts/theme'

const Button = <E extends ElementType = 'button'>(props: ButtonProps<E>): JSX.Element => {
  const { startIcon, endIcon, external, className, isLoading, disabled, children, ...rest } = props
  const internalProps = external ? getExternalLinkProps() : {}
  const isDisabled = isLoading || disabled
  const classNames = className ? [className] : []
  const scale = props.scale || (useResponsive().isMobile ? 'sm' : 'md')

  return (
    <StyledButton
      $isLoading={isLoading}
      className={classNames.join(' ')}
      disabled={isDisabled}
      scale={scale}
      {...internalProps}
      {...rest}
    >
      <>
        {
          isValidElement(startIcon) && (
            cloneElement(startIcon, {
              mr: '0.5rem'
            })
          )
        }
        {children}
        {isLoading && <DotLoader css={'margin-left: 8px'} size={'16px'} color={'#ccc'} />}
        {
          isValidElement(endIcon) && (
            cloneElement(endIcon, {
              ml: '0.5rem'
            })
          )
        }
      </>
    </StyledButton>
  )
}

Button.defaultProps = {
  isLoading: false,
  external: false,
  variant: variants.PRIMARY,
  disabled: false,
}

export default Button
