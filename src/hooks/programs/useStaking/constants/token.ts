import { PublicKey } from '@solana/web3.js'

const TOKEN_KSE: StakingToken = {
  name: 'sKSE',
  icon: require('@/assets/images/banksea.jpg'),
  tokenMint: new PublicKey('SKSE1d9hHn4jJGejGzuwnpD8DMM5TBKQ18ikUFSrx1C')
}

export interface StakingToken {
  name: string
  icon: string
  tokenMint: PublicKey
}

export type TokenStakingPoolConfig = {
  currencies: [StakingToken] | [StakingToken, StakingToken]
  pool: PublicKey
  // whitelist: PublicKey
  depositToken: StakingToken
  rewardToken: StakingToken
}

const TOKEN_STAKING_POOLS: TokenStakingPoolConfig[] = [
  {
    currencies: [TOKEN_KSE],
    pool: new PublicKey('Hn4qWvAHpWYceMyjKgf3bmwh2onY7FzFZVZqEAXJwLMM'),
    // whitelist: new PublicKey('2NxYkFddkdk9L3gdqMoUf22UQe9FKwCQUfrRDpmdZGNJ'),
    depositToken: TOKEN_KSE,
    rewardToken: TOKEN_KSE,
  },
]

export {
  TOKEN_STAKING_POOLS
}
