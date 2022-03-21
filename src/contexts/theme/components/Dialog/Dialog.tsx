import React, { useMemo } from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { ButtonProps } from '@/contexts/theme/components/Button'
import { CardProps } from '@/contexts/theme/components/Card'
import { TextProps } from '@/contexts/theme/components/Text'

export type DialogProps = CardProps & {
  title: string | JSX.Element
  footer?: string | JSX.Element
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
  onConfirm?: () => void
  onCancel?: () => void
  bottomMessage?: string | TextProps
}

const Dialog: React.FC<DialogProps> = ({
  title,
  cancelButtonProps,
  confirmButtonProps,
  showCancelButton = true,
  showConfirmButton = true,
  onCancel,
  onConfirm,
  bottomMessage,
  children,
  ...rest
}) => {
  const hasBottomMessage = useMemo(() => {
    if (typeof bottomMessage === 'string') {
      return bottomMessage?.length
    }

    return bottomMessage?.children
  }, [bottomMessage])

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
      <Flex
        justifyCenter
        alignItemsCenter
      >
        {
          showCancelButton && (
            <Button style={{ flex: 8 }} {...cancelButtonProps} onClick={onCancel} variant={'danger'}>
              Cancel
            </Button>
          )
        }
        {
          (showConfirmButton && showCancelButton) ? <div style={{ flex: 1 }} /> : undefined
        }
        {
          showConfirmButton && (
            <Button style={{ flex: 8 }} {...confirmButtonProps} onClick={onConfirm}>
              {confirmButtonProps?.children || 'Confirm'}
            </Button>
          )
        }
      </Flex>

      {
        hasBottomMessage ? (
          typeof bottomMessage === 'string' ? (
            <Text mt={'16px'} bold textAlign={'center'}>
              {bottomMessage}
            </Text>
          ) : (
            <Text mt={'16px'} bold textAlign={'center'} {...bottomMessage}>
              {bottomMessage?.children}
            </Text>
          )
        ) : <></>
      }
    </Card>
  )
}

export default Dialog
