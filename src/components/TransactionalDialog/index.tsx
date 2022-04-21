import React, { useCallback, useEffect, useState } from 'react'
import { SOLANA_CLUSTER, useModal, useRefreshController, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Dialog, notify, Text } from '@/contexts/theme/components'
import { DialogProps } from '@/contexts/theme/components/Dialog/Dialog'
import { BeatLoader } from 'react-spinners'
import { TextProps } from '@/contexts/theme/components/Text'
import { WalletError } from '@solana/wallet-adapter-base'
import { sleep, waitTransactionConfirm } from '@/utils'
import { Transaction } from '@solana/web3.js'
import { isArray } from 'lodash'

const TransactionStages = {
  building: 'Building transaction...',
  built: 'Please approve transaction in you wallet',
  sent: (
    <div>
      <Text fontSize={'18px'} textAlign={'center'}>
        Transaction has been sent. Wait for confirmation...
      </Text>
      <Text fontSize={'18px'} textAlign={'center'}>
        You can close this dialog now
      </Text>
      <BeatLoader color={'#abc'} size={12} />
    </div>
  ),
  complete: '✅ Transaction completed!',
  error: (e: any) => `⚠️ Transaction failed: ${e.message || e.toString()}`
}

export interface TransactionalDialogProps extends Omit<DialogProps, 'bottomMessage'> {
  transactionName: string
  error?: string
  transactionsBuilder: () => Promise<Transaction[] | Transaction>
}

const TransactionalDialog: React.FC<TransactionalDialogProps> = ({ transactionsBuilder, children, confirmButtonProps, cancelButtonProps, onConfirm, onCancel, transactionName, error, ...rest }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const [message, setMessage] = useState<string | JSX.Element>()
  const [messageType, setMessageType] = useState<TextProps['color']>('text')
  const [closable, setClosable] = useState(true)
  const [ongoing, setOngoing] = useState(false)
  const [done, setDone] = useState(false)
  const [signature, setSignature] = useState<string>()
  const [innerError, setInnerError] = useState<string>()
  const { adapter } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()

  const onTransactionConfirm = (signatures: string[] | string = [])=> {
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

  const handleConfirm = useCallback(async () => {
    if (signature) {
      window.open(`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`, '_blank', 'noreferrer')
      return
    }

    if (!adapter) {
      throw new Error('Wallet not connected')
    }

    onConfirm?.()

    setOngoing(true)
    setInnerError(undefined)
    setClosable(false)
    setMessage(TransactionStages.building)
    setMessageType('text')

    try {
      const transactions = await transactionsBuilder()
      setMessage(TransactionStages.built)

      const rawTransactions = await adapter.signAllTransactions(isArray(transactions) ? transactions : [transactions])
      const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
      setMessage(TransactionStages.sent)
      setClosable(true)
      forceRefresh()

      await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
      onTransactionConfirm(signatures)
    } catch (e: any) {
      console.error(e)
      const { error, message } = e as WalletError

      setOngoing(false)
      setClosable(true)
      setInnerError(message || error?.message || error?.toString() || 'Unknown Error')
    }
  }, [adapter, onConfirm, signature, connection, transactionsBuilder])

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
