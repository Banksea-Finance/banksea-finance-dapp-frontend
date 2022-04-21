
export const WalletNotConnectedError = new Error('Wallet not connected')

export const DataLoadFailedError = (data: string) => new Error(`Failed to load data: ${data}`)
