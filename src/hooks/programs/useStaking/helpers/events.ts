export type TransactionEvents = 'onSent' | 'onConfirm' | 'onTransactionBuilt'

export type EventCallback = Partial<Record<TransactionEvents, (...args: any) => void>>
