export type TransactionEvents = 'onSent' | 'onConfirm' | 'onBuilding'

export type EventCallback = Partial<Record<TransactionEvents, () => void>>
