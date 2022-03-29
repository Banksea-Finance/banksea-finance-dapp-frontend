import React from 'react'
import styled, { CSSProperties } from 'styled-components'
import { Text } from '@/contexts/theme/components'
import { flexbox, FlexboxProps, layout, LayoutProps, space, SpaceProps } from 'styled-system'

export type FormItemLabelPosition = 'left' | 'top' | 'right'

export interface FormItemProps extends StyledFormItemProps {
  label: string
  labelWidth?: CSSProperties['width']
  labelPosition?: FormItemLabelPosition
}

type StyledFormItemProps = LayoutProps & SpaceProps & FlexboxProps

const StyledFormItem = styled.div<StyledFormItemProps>`
  display: flex;
  
  ${flexbox}
  ${space}
  ${layout}
`

const Label = styled(Text)`
`

const FormItem: React.FC<FormItemProps> = ({ label, labelPosition = 'left', labelWidth, minHeight = '48px', children, ...rest }) => {
  return (
    <StyledFormItem
      alignItems={labelPosition === 'top' ? 'start' : 'center'}
      flexDirection={labelPosition === 'top' ? 'column' : 'row'}
      minHeight={minHeight}
      {...rest}
    >
      <Label
        textAlign={labelPosition === 'right' ? 'end' : 'start'}
        mb={labelPosition === 'top' ? '4px' : '0'}
        width={labelWidth}
        mr={'8px'}
      >
        {label}
      </Label>
      {
        children
      }
    </StyledFormItem>
  )
}

export { FormItem }
