import React, { useEffect, useMemo } from 'react'
import { Button, ButtonProps } from '../Button'
import { Card, CardProps } from '../Card'
import { Text, TextProps } from '../Text'
import CloseIcon from '../../assets/images/close.svg'
import { useModal } from '@/contexts'
import { useResponsive } from '../../hooks'
import { Flex } from '../Box'

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
  minWidth,
  width,
  ...rest
}) => {
  const { closeModal } = useModal()
  const { isMobile } = useResponsive()

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
    <Card
      flexDirection={'column'}
      p={'24px'}
      minWidth={minWidth || (!isMobile ? '448px' : undefined)}
      maxWidth={'min(1080px, 90vw)'}
      width={isMobile ? '95vw' : width}
      {...rest}
    >
      <Flex
        jc={'space-between'}
        ai={'center'}
        style={{ borderBottom: '1px solid #909090', paddingBottom: '8px', marginBottom: '32px' }}
      >
        <Flex ai={'center'}>
          {titlePrefix}
          <Text fontSize={'20px'} important fontWeight={500} color={'primary'}>
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
        style={{ marginTop: (onCancel || onConfirm) ? '32px' : '0' }}
        jc={'center'}
        ai={'center'}
      >
        {
          onCancel && (
            <Button style={{ flex: 8 }} {...cancelButtonProps} onClick={onCancel} variant={'danger'} minWidth={'fit-content'}>
              {cancelButtonProps?.children || 'Cancel'}
            </Button>
          )
        }
        {
          (onCancel && onConfirm) ? <div style={{ flex: 1 }} /> : undefined
        }
        {
          onConfirm && (
            <Button style={{ flex: 8 }} {...confirmButtonProps} onClick={onConfirm} minWidth={'fit-content'}>
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
