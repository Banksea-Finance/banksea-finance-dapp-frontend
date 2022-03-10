import type { PublicKey } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'

import Wallet from '@project-serum/sol-wallet-adapter'
import EventEmitter from 'eventemitter3'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSolanaConnectionConfig } from '@/contexts/solana-connection-config'
import { shortenAddress } from '@/utils'
import useEagerConnect from '@/hooks/useEagerConnect'
import useLocalStorage, { LOCAL_STORAGE_WALLET_KEY } from '@/hooks/useLocalStorage'
import { SUPPORT_WALLETS } from '@/contexts/solana-web3/constant'
import { notify } from '@/contexts/theme/components'

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey
  signTransaction: (tx: Transaction) => Promise<Transaction>
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>
  connect: () => any
  disconnect: () => any
}

export type SupportWalletNames = 'Phantom' | 'Slope'
// | 'Solflare'
// | 'Solong'
// | 'MathWallet'
// | 'Ledger'
// | 'Sollet'

export type SolanaWallet = {
  name: SupportWalletNames
  url: string
  icon: string
  adapter?: new () => WalletAdapter
}

export type WalletContextValues = {
  adapter: WalletAdapter | undefined
  connected: boolean
  select: (name: SupportWalletNames) => void
  wallet: SolanaWallet | undefined
  account?: PublicKey
  // connect: () => void
  disconnect: () => void
}

const SolanaWeb3Context = React.createContext<WalletContextValues>({
  adapter: undefined,
  connected: false,
  select: (_name: SupportWalletNames) => {},
  wallet: undefined,
  // connect: () => {},
  disconnect: () => {}
})

export const SolanaWeb3Provider: React.FC = ({ children }) => {
  const { endpointUrl } = useSolanaConnectionConfig()

  const [, setLocalStoredWallet] = useLocalStorage<SupportWalletNames>(LOCAL_STORAGE_WALLET_KEY)

  const [wallet, setWallet] = useState<SolanaWallet>()
  const [connected, setConnected] = useState(false)

  const select = (key: SupportWalletNames) => {
    setWallet(SUPPORT_WALLETS[key])
  }

  const { eagerConnected } = useEagerConnect()

  useEffect(() => {
    if (eagerConnected) {
      setWallet(SUPPORT_WALLETS.Phantom)
    }
  }, [eagerConnected])

  const adapter = useMemo(() => {
    if (!wallet) {
      return undefined
    }

    return new (wallet.adapter || Wallet)(wallet.url, endpointUrl) as WalletAdapter
  }, [wallet, endpointUrl])

  // after wallet being set, automatically execute connect method
  useEffect(() => {
    if (wallet && adapter) {
      adapter
        .connect()
        .then(() => {
          setLocalStoredWallet(wallet.name)
        })
        .catch(() => {
          setWallet(undefined)
        })
    }
  }, [wallet, adapter])

  const account = useMemo(() => {
    if (!connected) {
      return undefined
    }

    return adapter?.publicKey || undefined
  }, [connected, adapter])

  const disconnect = useCallback(() => {
    adapter?.disconnect()
    setWallet(undefined)
    setLocalStoredWallet(undefined)
  }, [adapter])

  useEffect(() => {
    if (adapter) {
      adapter.on('connect', () => {
        if (!adapter.publicKey) {
          console.error('adapter connected, but got null publicKey!')
          return
        }

        setConnected(true)
        const walletPublicKey = adapter.publicKey.toBase58()
        const keyToDisplay = walletPublicKey.length > 20 ? shortenAddress(walletPublicKey) : walletPublicKey

        notify({
          title: 'Wallet update',
          message: 'Connected to wallet ' + keyToDisplay
        })
      })

      adapter.on('disconnect', () => {
        setConnected(false)
        notify({
          title: 'Wallet update',
          message: 'Disconnected from wallet'
        })
      })
    }

    return () => {
      setConnected(false)
      if (adapter) {
        adapter.disconnect()
      }
      adapter?.removeAllListeners()
    }
  }, [adapter])

  return (
    <SolanaWeb3Context.Provider
      value={{
        adapter,
        connected,
        select,
        wallet,
        account,
        disconnect
      }}
    >
      {children}
    </SolanaWeb3Context.Provider>
  )
}

export function useSolanaWeb3() {
  return useContext(SolanaWeb3Context)
}
