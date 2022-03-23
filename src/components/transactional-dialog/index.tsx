import React, { useCallback, useState } from 'react'
import { SOLANA_CLUSTER, useModal, useRefreshController } from '@/contexts'
import { Dialog } from '@/contexts/theme/components'
import { DialogProps } from '@/contexts/theme/components/Dialog/Dialog'
import { EventCallback } from '@/hooks/programs/useStaking/helpers/events'

const TransactionStages = {
  building: 'Building transaction...',
  built: 'Please approve transaction in you wallet',
  sent: 'Transaction has been sent. Wait for confirmation...',
  complete: (signature?: string) => (
    <>
      Transaction completed!{' '}
      {signature && (
        <a href={`https://solscan.io/tx/${signature}?cluster=${SOLANA_CLUSTER}`} target={'_blank'} rel="noreferrer">
          View transaction on Solscan.
        </a>
      )}
    </>
  ),
  error: (e: any) => `Transaction failed: ${e.message || e.toString()}`
}

export type TransactionalDialogProps = DialogProps & {
  onSendTransaction: (callbacks: EventCallback) => Promise<any>
}

const TransactionalDialog: React.FC<TransactionalDialogProps> = ({ onSendTransaction, children, confirmButtonProps, cancelButtonProps, onConfirm, onCancel, ...rest }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const [message, setMessage] = useState<string | JSX.Element>()
  const [ongoing, setOngoing] = useState(false)
  const [done, setDone] = useState(false)

  const TransactionEventsCallbacks = {
    onTransactionBuilt: () => {
      setMessage(TransactionStages.built)
    },
    onSent: () => {
      setMessage(TransactionStages.sent)
    },
    onConfirm: (signature?: string)=> {
      forceRefresh()
      setOngoing(false)
      setDone(true)
      setMessage(TransactionStages.complete(signature))
    }
  }

  const handleConfirm = useCallback(() => {
    onConfirm?.()

    setOngoing(true)
    setMessage(TransactionStages.building)

    onSendTransaction(TransactionEventsCallbacks)
      .catch(e => {
        setMessage(e?.message || e.toString())
        setOngoing(false)
      })
  }, [onSendTransaction, onConfirm])

  const handleCancel = () => {
    onCancel?.()
    closeModal()
  }

  return (
    <Dialog
      {...rest}
      closeable={!ongoing}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      bottomMessage={{ children: message }}
      confirmButtonProps={{ ...confirmButtonProps, isLoading: ongoing, disabled: done }}
      cancelButtonProps={{ ...cancelButtonProps, disabled: ongoing, children: done ? 'Close' : undefined }}
    >
      {children}
    </Dialog>
  )
}

export default TransactionalDialog
