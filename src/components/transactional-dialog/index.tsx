import React, { useCallback, useState } from 'react'
import { SOLANA_CLUSTER, useModal, useRefreshController } from '@/contexts'
import { Dialog, notify, Text } from '@/contexts/theme/components'
import { DialogProps } from '@/contexts/theme/components/Dialog/Dialog'
import { BeatLoader } from 'react-spinners'
import { TextProps } from '@/contexts/theme/components/Text'

export type TransactionEvents = 'onSent' | 'onConfirm' | 'onTransactionBuilt'

export type TransactionEventCallback = Partial<Record<TransactionEvents, (...args: any) => void>>

const TransactionStages = {
  building: 'Building transaction...',
  built: 'Please approve transaction in you wallet',
  sent: (
    <div>
      <Text fontSize={'18px'} textAlign={'center'} >Transaction has been sent. Wait for confirmation...</Text>
      <Text fontSize={'18px'} textAlign={'center'} >You can close this dialog now</Text>
      <BeatLoader color={'#abc'} size={12} />
    </div>
  ),
  complete: '✅ Transaction completed!',
  error: (e: any) => `⚠️ Transaction failed: ${e.message || e.toString()}`
}

export type TransactionalDialogProps = DialogProps & {
  onSendTransaction: (callbacks: TransactionEventCallback) => Promise<any>
  transactionName: string
}

const TransactionalDialog: React.FC<TransactionalDialogProps> = ({ onSendTransaction, children, confirmButtonProps, cancelButtonProps, onConfirm, onCancel, transactionName, bottomMessage, ...rest }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const [message, setMessage] = useState<string | JSX.Element>()
  const [messageType, setMessageType] = useState<TextProps['color']>('text')
  const [closable, setClosable] = useState(true)
  const [ongoing, setOngoing] = useState(false)
  const [done, setDone] = useState(false)
  const [signature, setSignature] = useState<string>()

  const TransactionEventsCallbacks: TransactionEventCallback = {
    onTransactionBuilt: () => {
      setMessage(TransactionStages.built)
    },
    onSent: () => {
      setMessage(TransactionStages.sent)
      setClosable(true)
    },
    onConfirm: (signature?: string)=> {
      forceRefresh()
      setOngoing(false)
      setDone(true)
      setMessage(TransactionStages.complete)
      setSignature(signature)
      setMessageType('success')

      notify({
        title: transactionName,
        type: 'success',
        message: (
          <div>
            <span>Transaction completed! </span>
            <a style={{ color: '#49efba' }} href={`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`} target={'_blank'} rel="noreferrer">
              View on Solscan
            </a>
          </div>
        ),
        duration: 10
      })
    }
  }

  const handleConfirm = useCallback(() => {
    if (signature) {
      window.open(`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`, '_blank', 'noreferrer')
      return
    }

    onConfirm?.()

    setOngoing(true)
    setClosable(false)
    setMessage(TransactionStages.building)
    setMessageType('text')

    onSendTransaction(TransactionEventsCallbacks)
      .catch(e => {
        setOngoing(false)
        setClosable(true)
        setMessage(e?.message || e.toString())
        setMessageType('failure')
      })
  }, [onSendTransaction, onConfirm, signature])

  const handleCancel = () => {
    onCancel?.()
    closeModal()
  }

  return (
    <Dialog
      {...rest}
      closeable={closable}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      bottomMessage={bottomMessage || { children: !(ongoing || done) ? message : undefined, color: messageType }}
      cancelButtonProps={{ ...cancelButtonProps, disabled: !closable, children: 'Close' }}
      confirmButtonProps={{
        ...confirmButtonProps,
        isLoading: ongoing,
        disabled: confirmButtonProps?.disabled,
        children: signature && 'View on Solscan',
        color: signature && 'success',
      }}
    >
      {
        (ongoing || done)
          ? <Text fontSize={'18px'} textAlign={'center'} color={messageType}>{message}</Text>
          : children
      }
    </Dialog>
  )
}

export default TransactionalDialog
