import { useCallback, useMemo } from 'react'
import { SupportedChainIds, SupportWalletNames, WalletConfig } from '@/hooks/useMultiChainsWeb3/types'

import { MetaMask } from '@web3-react/metamask'
import { CHAINS, WALLETS } from '@/hooks/useMultiChainsWeb3/constants'
import useLocalStorage from '@/hooks/useLocalStorage'
import { WalletConnect } from '@web3-react/walletconnect'
import { Web3Provider } from '@ethersproject/providers'

const CONNECTED_WALLET_STORAGE_KEY = 'CONNECTED_WALLET_STORAGE_KEY'


const useAccounts = (): Record<SupportWalletNames, string | undefined>  => {
  return Object.fromEntries(
    Object.entries(WALLETS).map(([walletName, wallet]) => [walletName, wallet.hooks.useAccount()])
  ) as Record<SupportWalletNames, string | undefined>
}

const useChainIds = (): Record<SupportWalletNames, number | undefined>  => {
  return Object.fromEntries(
    Object.entries(WALLETS).map(([walletName, wallet]) => [walletName, wallet.hooks.useChainId()])
  ) as Record<SupportWalletNames, number | undefined>
}

const useProviders = (): Record<SupportWalletNames, Web3Provider | undefined>  => {
  return Object.fromEntries(
    Object.entries(WALLETS).map(([walletName, wallet]) => [walletName, wallet.hooks.useProvider()])
  ) as Record<SupportWalletNames, Web3Provider | undefined>
}

export const useMultiChainsWeb3 = () => {
  const [connectedWallet, setConnectedWallet] = useLocalStorage<SupportWalletNames>(CONNECTED_WALLET_STORAGE_KEY)

  const accounts = useAccounts()
  const chainIds = useChainIds()
  const providers = useProviders()

  const account = useMemo(() => {
    return connectedWallet ? accounts[connectedWallet] : undefined
  }, [connectedWallet, accounts])

  const chainId = useMemo(() => {
    return connectedWallet ? chainIds[connectedWallet] : undefined
  }, [connectedWallet, chainIds])

  const provider = useMemo(() => {
    return connectedWallet ? providers[connectedWallet] : undefined
  }, [connectedWallet, providers])

  const activate = useCallback(async (wallet: WalletConfig, chainId?: SupportedChainIds) => {
    const chain = chainId ? CHAINS[chainId] : undefined

    const connector = wallet.connector

    if (connector instanceof MetaMask) {
      if (chainId && chain) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chainLogo, ...config } = chain

        await connector.activate({
          ...config,
          chainId
        })
      } else {
        await connector.activate()
      }

      setConnectedWallet('Metamask')
    }

    if (connector instanceof WalletConnect) {
      await connector.activate(chainId)
      setConnectedWallet('WalletConnect')
    }
  }, [])

  const disconnect = useCallback(() => {
    if (!connectedWallet) return

    const wallet = WALLETS[connectedWallet]

    return wallet.connector.deactivate()
  }, [connectedWallet])

  return {
    account,
    chainId,
    connectedWallet,
    provider,
    disconnect,
    activate
  }
}
