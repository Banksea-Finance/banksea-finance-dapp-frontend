import { PhantomWalletAdapter, SlopeWalletAdapter } from '@/contexts/solana-web3/wallet-adapters'
import { SolanaWallet, SupportWalletNames } from '@/contexts'

export const SUPPORT_WALLETS: Record<SupportWalletNames, SolanaWallet> = {
  Phantom: {
    name: 'Phantom',
    url: 'https://phantom.app/',
    icon: require('@/assets/images/wallet-icons/phantom.png'),
    adapter: PhantomWalletAdapter
  },
  Slope: {
    name: 'Slope',
    url: '',
    icon: require('@/assets/images/wallet-icons/slope.png'),
    adapter: SlopeWalletAdapter
  }
  // 'Solflare': {
  //   name: 'Solflare',
  //   url: 'https://solflare.com/access-wallet',
  //   icon: ''
  // },
  // 'Solong': {
  //   name: 'Solong',
  //   url: 'https://solongwallet.com',
  //   icon: `${ASSETS_URL}solong.png`,
  //   adapter: SolongWalletAdapter
  // },
  // 'MathWallet': {
  //   name: 'MathWallet',
  //   url: 'https://mathwallet.org',
  //   icon: `${ASSETS_URL}mathwallet.svg`
  // },
  // 'Ledger': {
  //   name: 'Ledger',
  //   url: 'https://www.ledger.com',
  //   icon: `${ASSETS_URL}ledger.svg`,
  //   adapter: LedgerWalletAdapter
  // },
  // 'Sollet': {
  //   name: 'Sollet',
  //   url: 'https://www.sollet.io',
  //   icon: `${ASSETS_URL}sollet.svg`
  // }
} as const
