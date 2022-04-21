import React from 'react'
import { CheckboxProps, getScale } from './types'
import { Flex } from '../Box'
import StyledCheckbox from './StyledCheckbox'
import { Text } from '../Text'

const Checkbox: React.FC<CheckboxProps> = props => {
  const { label, labelTextStyles, className, ...rest } = props

  return (
    <Flex alignItems={'center'} className={className}>
      <StyledCheckbox {...rest} />
      {label && (
        <Text fontSize={getScale(props)} {...labelTextStyles}>
          {label}
        </Text>
      )}
    </Flex>
  )
}

export default Checkbox
