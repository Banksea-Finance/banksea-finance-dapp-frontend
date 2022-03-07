import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { AddEthereumChainParameter } from '@web3-react/types'

export const SUPPORTED_WALLET_KEYS = {
  METAMASK: 'Metamask',
  WALLET_CONNECT: 'WalletConnect',
  SLOPE: 'Slope',
  PHANTOM: 'Phantom'
} as const

export type SupportedWalletKeys = keyof typeof SUPPORTED_WALLET_KEYS

export const SUPPORTED_CHAIN_KEYS = {
  POLYGON: 'Polygon Mainnet',
  BSC: 'Binance Smart Chain',
  SOLANA: 'Solana Mainnet',
  OEC: 'OEC Mainnet'
} as const

export type SupportedChainKeys = keyof typeof SUPPORTED_CHAIN_KEYS

type SupportChainBase = {
  chainKey: SupportedChainKeys
  chainLogo: string
  connect: () => void
  supportWallets: SupportedWalletKeys[]
}

export type SolanaChainConfig = SupportChainBase

type EthereumChainConfig = AddEthereumChainParameter

export type SupportChain = SupportChainBase & (SolanaChainConfig | EthereumChainConfig)

const [metamaskConnector, metamaskHooks] = initializeConnector<MetaMask>(actions => new MetaMask(actions))

export const SUPPORTED_CHAINS: SupportChain[] = [
  {
    chainKey: 'POLYGON',
    chainLogo: require('@/assets/images/chains/polygon.png'),
    chainId: 137,
    connect: metamaskConnector.activate,
    nativeCurrency: {
      name: 'MATIC Token',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com'
    ],
    supportWallets: ['METAMASK', 'WALLET_CONNECT']
  },
  {
    chainKey: 'BSC',
    chainLogo: require('@/assets/images/chains/bsc.png'),
    chainId: 56,
    connect: metamaskConnector.activate,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
    ],
    supportWallets: ['METAMASK', 'WALLET_CONNECT']
  },
  {
    chainKey: 'SOLANA',
    chainLogo: require('@/assets/images/chains/solana.png'),
    connect: () => {},
    supportWallets: ['PHANTOM', 'SLOPE']
  },
  {
    chainKey: 'OEC',
    chainLogo: require('@/assets/images/chains/okex.png'),
    chainId: 66,
    connect: metamaskConnector.activate,
    nativeCurrency: {
      name: 'OKT',
      symbol: 'OKT',
      decimals: 18
    },
    rpcUrls: [
      'https://exchainrpc.okex.org',
    ],
    supportWallets: ['METAMASK', 'WALLET_CONNECT']
  },
]

export type SupportedWallet = {
  walletKey: keyof typeof SUPPORTED_WALLET_KEYS
  icon: string
}

export const SUPPORTED_WALLETS: SupportedWallet[] = [
  {
    walletKey: 'METAMASK',
    icon: require('@/assets/images/wallet-icons/metamask.png'),
  },
  {
    walletKey: 'WALLET_CONNECT',
    icon: require('@/assets/images/wallet-icons/walletconnect.png'),
  },
  {
    walletKey: 'PHANTOM',
    icon: require('@/assets/images/wallet-icons/phantom.png'),
  },
  {
    walletKey: 'SLOPE',
    icon: require('@/assets/images/wallet-icons/slope.png'),
  },
]

export const useMultiChains = () => {

  metamaskConnector.activate()
}
