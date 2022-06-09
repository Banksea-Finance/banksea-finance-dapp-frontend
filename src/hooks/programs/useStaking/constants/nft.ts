import { PublicKey } from '@solana/web3.js'
import { CitizenOneCollectionCreator } from '@/utils/constants'

export type NFTStakingPoolConfig = {
  pool: PublicKey
  name: string
  logo: string
  candyMachineAddress?: PublicKey
  creator: PublicKey
  rewardTokenName: string
}

export const NFT_STAKING_POOLS: NFTStakingPoolConfig[] = [
  {
    pool: new PublicKey('22ozAGwMjg1EBYWB2CbvnEXNaDc8YPpjFnwgeTpRtpjH'),
    creator: CitizenOneCollectionCreator,
    name: 'CitizenOne-sKSE',
    logo: require('@/assets/images/citizen-one.webp'),
    rewardTokenName: 'sKSE'
  }
]
