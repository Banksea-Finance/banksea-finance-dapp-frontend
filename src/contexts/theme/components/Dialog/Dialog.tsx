import React, { useEffect, useMemo } from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { ButtonProps } from '@/contexts/theme/components/Button'
import { CardProps } from '@/contexts/theme/components/Card'
import { TextProps } from '@/contexts/theme/components/Text'
import CloseIcon from '@/assets/images/close.svg'
import { useModal } from '@/contexts'

export type DialogProps = CardProps & {
  title: string | JSX.Element
  titlePrefix?: React.ReactElement
  footer?: string | JSX.Element
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
  onConfirm?: () => void
  onCancel?: () => void
  bottomMessage?: string | TextProps
  closeable?: boolean
}

const Dialog: React.FC<DialogProps> = ({
  title,
  titlePrefix,
  cancelButtonProps,
  confirmButtonProps,
  closeable = true,
  onCancel,
  onConfirm,
  bottomMessage,
  children,
  ...rest
}) => {
  const { closeModal } = useModal()

  const hasBottomMessage = useMemo(() => {
    if (typeof bottomMessage === 'string') {
      return bottomMessage?.length
    }

    return bottomMessage?.children
  }, [bottomMessage])

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeable) closeModal()

      if (
        onConfirm
          && (e.key === 'Enter')
          && !confirmButtonProps?.disabled
          && !confirmButtonProps?.isLoading
      ) {
        onConfirm()
      }
    }

    window.addEventListener('keyup', cb)

    return () => {
      window.removeEventListener('keyup', cb)
    }
  }, [closeable, onConfirm, confirmButtonProps])

  return (
    <Card p={'24px'} minWidth={'448px'} {...rest} isActive>
      <Flex
        justifySpaceBetween
        alignItemsCenter
        style={{ borderBottom: '1px solid #909090', paddingBottom: '8px', marginBottom: '16px' }}
      >
        <Flex alignItemsCenter>
          {titlePrefix}
          <Text fontSize={'20px'} important fontWeight={500}>
            {title}
          </Text>
        </Flex>
        {
          closeable && (
            <img src={CloseIcon} style={{ cursor: 'pointer' }} alt={'close'} onClick={closeModal} />
          )
        }
      </Flex>

      { children }

      <Flex
        style={{ marginTop: (onCancel || onConfirm) ? '16px' : '0' }}
        justifyCenter
        alignItemsCenter
      >
        {
          onCancel && (
            <Button style={{ flex: 8 }} {...cancelButtonProps} onClick={onCancel} variant={'danger'}>
              {cancelButtonProps?.children || 'Cancel'}
            </Button>
          )
        }
        {
          (onCancel && onConfirm) ? <div style={{ flex: 1 }} /> : undefined
        }
        {
          onConfirm && (
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
