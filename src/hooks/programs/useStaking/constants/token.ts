import { PublicKey } from '@solana/web3.js'

const CURRENCY_KSE: Currency = {
  name: 'KSE',
  icon: 'https://pbs.twimg.com/profile_images/1483882473688043521/fpWDvR9k_400x400.jpg'
}

// const CURRENCY_ETH: Currency = {
//   name: 'ETH',
//   icon: 'https://www.gate.io/images/coin_icon/64/eth.png?v=1632807763'
// }
//
// const CURRENCY_USDC: Currency = {
//   name: 'USDC',
//   icon: 'https://w.namu.la/s/2a459b80b53e834d84a9057dab174f8ce7116b1ce96a5fe4bb2c4ac4680f5cbe93e0c117dcb245cd19378a7b7a4d55ea66d665d5b26909810e5ebb3aaa9e3c47999b524f65df6eafd1666fab31dded66'
// }

export type Currency = {
  name: string
  icon: string
}

export type TokenStakingPoolConfig = {
  currencies: [Currency] | [Currency, Currency]
  poolAddress: PublicKey
  whitelist: PublicKey
  rewardTokenName: string
}

const TOKEN_STAKING_POOLS: TokenStakingPoolConfig[] = [
  {
    currencies: [CURRENCY_KSE],
    poolAddress: new PublicKey('5CYkr8XpRfYtVVazee44WnvFpuAinMwBNEmxoEF5cRNa'),
    whitelist: new PublicKey('CGAoHE8JCcr11XphwhJPMRuPL4oZH1SY9gYAHCy1k1D3'),
    rewardTokenName: 'KSE'
  },
  // {
  //   currencies: [CURRENCY_KSE, CURRENCY_ETH],
  //   poolPublicKey: Keypair.generate().publicKey
  // },
  // {
  //   currencies: [CURRENCY_KSE, CURRENCY_USDC],
  //   poolPublicKey: Keypair.generate().publicKey
  // }
]

export {
  TOKEN_STAKING_POOLS
}
