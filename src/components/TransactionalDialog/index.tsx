import React, { useCallback, useEffect, useState } from 'react'
import { SOLANA_CLUSTER, useModal, useRefreshController } from '@/contexts'
import { Dialog, notify, Text } from '@/contexts/theme/components'
import { DialogProps } from '@/contexts/theme/components/Dialog/Dialog'
import { BeatLoader } from 'react-spinners'
import { TextProps } from '@/contexts/theme/components/Text'
import { WalletError } from '@solana/wallet-adapter-base/lib/esm/errors'
import { sleep } from '@/utils'
import { Signer, Transaction } from '@solana/web3.js'

// export type TransactionEvents = 'onSent' | 'onConfirm' | 'onTransactionBuilt'

// export type TransactionEventCallback = Partial<Record<TransactionEvents, (...args: any) => void>>
export type TransactionEventCallback = {
  onSent?: () => void
  onTransactionBuilt?: () => void
  onConfirm?: (signatures?: string[] | string) => void
}

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

export interface TransactionalDialogProps extends Omit<DialogProps, 'bottomMessage'> {
  onSendTransaction: (callbacks: TransactionEventCallback) => Promise<any>
  transactionName: string
  error?: string
  // transactionsBuilder: () => Promise<{ transactions: Transaction[], signers: Signer[] }>
}

const TransactionalDialog: React.FC<TransactionalDialogProps> = ({ onSendTransaction, children, confirmButtonProps, cancelButtonProps, onConfirm, onCancel, transactionName, error, ...rest }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const [message, setMessage] = useState<string | JSX.Element>()
  const [messageType, setMessageType] = useState<TextProps['color']>('text')
  const [closable, setClosable] = useState(true)
  const [ongoing, setOngoing] = useState(false)
  const [done, setDone] = useState(false)
  const [signature, setSignature] = useState<string>()
  const [innerError, setInnerError] = useState<string>()

  const TransactionEventsCallbacks: TransactionEventCallback = {
    onTransactionBuilt: () => {
      setMessage(TransactionStages.built)
    },
    onSent: () => {
      setMessage(TransactionStages.sent)
      setClosable(true)
      forceRefresh()
    },
    onConfirm: (signatures: string[] | string = [])=> {
      forceRefresh()
      setOngoing(false)
      setDone(true)
      setMessage(TransactionStages.complete)
      setSignature(signature)
      setMessageType('success')

      notify({
        title: 'Transaction Success',
        type: 'success',
        message: (
          <div>
            <span style={{ marginRight: '4px' }}>{transactionName}</span>
            <a
              style={{ color: '#49efba' }}
              onClick={async () => {
                if (typeof signatures === 'string') {
                  window.open(`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`, '_blank')
                } else {
                  for (const signature of signatures) {
                    window.open(`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`, '_blank')
                    await sleep(200)
                  }
                }
              }}
            >
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
    setInnerError(undefined)
    setClosable(false)
    setMessage(TransactionStages.building)
    setMessageType('text')

    onSendTransaction(TransactionEventsCallbacks)
      .catch(({ error, message }: WalletError ) => {
        setOngoing(false)
        setClosable(true)
        setInnerError(message || error?.message || error?.toString() || 'Unknown Error')
      })
  }, [onSendTransaction, onConfirm, signature])

  const handleCancel = () => {
    onCancel?.()
    closeModal()
  }

  useEffect(() => {
    setInnerError(error)
  }, [error])

  return (
    <Dialog
      {...rest}
      closeable={closable}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      bottomMessage={{ children: innerError, color: 'failure' }}
      cancelButtonProps={{ ...cancelButtonProps, disabled: !closable, children: 'Close' }}
      confirmButtonProps={{
        ...confirmButtonProps,
        isLoading: ongoing,
        disabled: done || confirmButtonProps?.disabled,
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
