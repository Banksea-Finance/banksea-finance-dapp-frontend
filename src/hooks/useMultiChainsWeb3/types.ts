import { AddEthereumChainParameter, Connector } from '@web3-react/types'
import { CHAINS } from './constants'
import { Web3ReactHooks } from '@web3-react/core'

export type SupportChains = { [chainId: number]: ChainConfig }

export type SupportedChainIds = keyof typeof CHAINS

export interface BasicChainInformation {
  rpcUrls: string[]
  chainName: string
}

export interface ChainConfig extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls?: AddEthereumChainParameter['blockExplorerUrls']

  chainLogo: string
}

export type WalletConfig = {
  name: SupportWalletNames
  icon: string
  connector: Connector
  hooks: Web3ReactHooks
}

export type SupportedWallets = Record<SupportWalletNames, WalletConfig>

export type SupportWalletNames = 'Metamask' | 'WalletConnect'
