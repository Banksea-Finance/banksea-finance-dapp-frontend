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
    poolAddress: new PublicKey('5BL4jdGZnHGYQULg1sE9pbHZ6yXRpZV4wTDZMxPJgF1g'),
    whitelist: new PublicKey('DehRQQP4fCFnFsduCjCFaqgNtrmGABxNVKj1jG1cXC64'),
    creator: new PublicKey('6eowspZT2akp1y8qGTzRDeJH5h8BZbew4feqawGfy5ez'),
    name: 'Test',
    // candyMachineAddress: new PublicKey(''),
    logo: 'https://content.solsea.io/files/thumbnail/1643474033004-292668735.png',
    rewardTokenName: 'KSE'
  }
]
