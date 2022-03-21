import { PublicKey } from '@solana/web3.js'

export type NFTStakingPoolConfig = {
  poolAddress: PublicKey
  whitelist: PublicKey
  name: string
  logo: string
  candyMachineAddress?: PublicKey
  creator: PublicKey
  rewardTokenName: string
}

export const NFT_STAKING_POOLS: NFTStakingPoolConfig[] = [
  {
    poolAddress: new PublicKey('9r8Tg2EB7NinBZchdrx6upiB5Z7DX3645sxUWz8sfXXc'),
    whitelist: new PublicKey('6VWanpd8GwrVrKo4sWpvY33Sys3bHgE3wiY43yXomh83'),
    creator: new PublicKey('6eowspZT2akp1y8qGTzRDeJH5h8BZbew4feqawGfy5ez'),
    name: 'Test',
    logo: 'https://content.solsea.io/files/thumbnail/1643474033004-292668735.png',
    rewardTokenName: 'KSE'
  }
]
