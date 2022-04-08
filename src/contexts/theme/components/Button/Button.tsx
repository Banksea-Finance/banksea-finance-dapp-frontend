import React, { ElementType, isValidElement } from 'react'
import getExternalLinkProps from '../../utils/getExternalLinkProps'
import StyledButton from './StyledButton'
import { ButtonProps, variants } from './types'
import { DotLoader } from 'react-spinners'
import { useResponsive } from '@/contexts/theme'
import { Flex } from '../Box'

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
      <Flex alignItems={'center'}>
        {isValidElement(startIcon) && <span style={{ marginRight: '4px' }}>{startIcon}</span>}
        {children}
        {isLoading && <DotLoader css={'margin-left: 8px'} size={'16px'} color={'#ccc'} />}
        {isValidElement(endIcon) && <span style={{ marginLeft: '4px' }}>{endIcon}</span>}
      </Flex>
    </StyledButton>
  )
}

Button.defaultProps = {
  isLoading: false,
  external: false,
  variant: variants.PRIMARY,
  disabled: false,
  scale: 'sm'
}

export default Button
