import React from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg'
import { ButtonProps } from '@/contexts/theme/components/Button'
import { CardProps } from '@/contexts/theme/components/Card'

export type DialogProps = CardProps & {
  title: string | JSX.Element
  footer?: string | JSX.Element
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
  onConfirm?: () => void
  onCancel?: () => void
}

const Dialog: React.FC<DialogProps> = ({
  title,
  cancelButtonProps,
  confirmButtonProps,
  onCancel,
  onConfirm,
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
        <Text onClick={onCancel}>
          <CloseIcon width={'24px'} height={'24px'} fill={'#909090'} style={{ cursor: 'pointer' }} />
        </Text>
      </Flex>
      <div style={{ marginBottom: '16px' }}>
        {children}
      </div>
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
    </Card>
  )
}

export default Dialog
