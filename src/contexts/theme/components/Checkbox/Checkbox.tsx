import React from 'react'
import { CheckboxProps, getScale } from '@/contexts/theme/components/Checkbox/types'
import { Flex } from '@/contexts/theme/components/Box'
import StyledCheckbox from '@/contexts/theme/components/Checkbox/StyledCheckbox'
import { Text } from '@/contexts/theme/components'

const Checkbox: React.FC<CheckboxProps> = props => {
  const { label, labelTextStyles, ...rest } = props

  return (
    <Flex alignItems={'center'}>
      <StyledCheckbox {...rest} />
      {
        label && (
          <Text
            fontSize={getScale(props)}
            {...labelTextStyles}
          >
            {label}
          </Text>
        )
      }
    </Flex>
  )
}

export default Checkbox
