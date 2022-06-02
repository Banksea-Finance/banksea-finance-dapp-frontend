import { PublicKey } from '@solana/web3.js'

const CURRENCY_KSE: Currency = {
  name: 'KSE',
  icon: require('@/assets/images/banksea.jpg')
}

export type Currency = {
  name: string
  icon: string
}

export type TokenStakingPoolConfig = {
  currencies: [Currency] | [Currency, Currency]
  pool: PublicKey
  whitelist: PublicKey
  depositTokenName: string
  rewardTokenName: string
}

const TOKEN_STAKING_POOLS: TokenStakingPoolConfig[] = [
  {
    currencies: [CURRENCY_KSE],
    pool: new PublicKey('5CYkr8XpRfYtVVazee44WnvFpuAinMwBNEmxoEF5cRNa'),
    whitelist: new PublicKey('CGAoHE8JCcr11XphwhJPMRuPL4oZH1SY9gYAHCy1k1D3'),
    depositTokenName: 'KSE',
    rewardTokenName: 'KSE'
  },
]

export {
  TOKEN_STAKING_POOLS
}
