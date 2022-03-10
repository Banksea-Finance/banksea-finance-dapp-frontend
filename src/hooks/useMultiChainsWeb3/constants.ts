import { SupportChains, SupportedWallets } from './types'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'

export const CHAINS: SupportChains = {
  137: {
    rpcUrls: [
      // 'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com'
    ],
    chainName: 'Polygon mainnet',
    nativeCurrency: {
      name: 'MATIC Token',
      symbol: 'MATIC',
      decimals: 18
    },
    chainLogo: require('@/assets/images/chains/polygon.png')
  },
  56: {
    chainName: 'Binance Smart Chain',
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/'
    ],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    chainLogo: require('@/assets/images/chains/bsc.png')
  },
  66: {
    chainName: 'OEC Mainnet',
    rpcUrls: ['https://exchainrpc.okex.org'],
    nativeCurrency: {
      name: 'OKT',
      symbol: 'OKT',
      decimals: 18
    },
    chainLogo: require('@/assets/images/chains/okex.png')
  }
}

const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].rpcUrls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)

const [metamaskConnector, metamaskHooks] = initializeConnector<MetaMask>(actions => new MetaMask(actions))

const [walletConnectConnector, walletConnectHooks] = initializeConnector<WalletConnect>(
  actions =>
    new WalletConnect(actions, {
      rpc: URLS
    }),
  Object.keys(URLS).map(chainId => Number(chainId))
)

export const WALLETS: SupportedWallets = {
  'Metamask': {
    name: 'Metamask',
    icon: require('@/assets/images/wallet-icons/metamask.png'),
    connector: metamaskConnector,
    hooks: metamaskHooks
  },
  'WalletConnect': {
    name: 'WalletConnect',
    icon: require('@/assets/images/wallet-icons/walletconnect.png'),
    connector: walletConnectConnector,
    hooks: walletConnectHooks
  }
}
