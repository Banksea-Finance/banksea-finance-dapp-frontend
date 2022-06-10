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
    pool: new PublicKey('5c1b8uZgUAL1v8oAoW575Dgr1FmUncYeaDqntDw4BC2a'),
    creator: CitizenOneCollectionCreator,
    name: 'CitizenOne-sKSE',
    logo: require('@/assets/images/citizen-one.webp'),
    rewardTokenName: 'sKSE'
  }
]
