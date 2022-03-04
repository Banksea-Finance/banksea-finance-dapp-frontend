import React from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { ButtonProps } from '@/contexts/theme/components/Button'
import { CardProps } from '@/contexts/theme/components/Card'

export type DialogProps = CardProps & {
  title: string | JSX.Element
  footer?: string | JSX.Element
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
  onConfirm?: () => void
  onCancel?: () => void
  bottomMessage?: string | JSX.Element
}

const Dialog: React.FC<DialogProps> = ({
  title,
  cancelButtonProps,
  confirmButtonProps,
  onCancel,
  onConfirm,
  bottomMessage,
  children,
  ...rest
}) => {
  return (
    <Card p={'24px'} minWidth={'350px'} {...rest} isActive>
      <Flex
        justifySpaceBetween
        alignItemsCenter
        style={{ borderBottom: '1px solid #909090', paddingBottom: '8px', marginBottom: '16px' }}
      >
        <Text bold fontSize={'24px'}>
          {title}
        </Text>
      </Flex>
      <div style={{ marginBottom: '16px' }}>{children}</div>
      <div
        style={{
          display: 'grid',
          columnGap: '20px',
          padding: '0 10%',
          gridTemplateColumns: 'repeat(2, 1fr)'
        }}
      >
        <Button {...cancelButtonProps} onClick={onCancel} variant={'danger'}>
          Cancel
        </Button>
        <Button {...confirmButtonProps} onClick={onConfirm}>
          {confirmButtonProps?.children || 'Confirm'}
        </Button>
      </div>

      <div style={{ marginTop: '16px' }}>
        {bottomMessage}
      </div>
    </Card>
  )
}

export default Dialog
