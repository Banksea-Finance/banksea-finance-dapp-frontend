import { PublicKey } from '@solana/web3.js'
import { CitizenOneCollectionCreator } from '@/utils/constants'

export type NFTStakingPoolConfig = {
  pool: PublicKey
  whitelist: PublicKey
  name: string
  logo: string
  candyMachineAddress?: PublicKey
  creator: PublicKey
  rewardTokenName: string
}

export const NFT_STAKING_POOLS: NFTStakingPoolConfig[] = [
  {
    pool: new PublicKey('9ug4pBAT18tQeQWcvPogXRk7Ma35qRnBpNSCMHMPRh22'),
    whitelist: new PublicKey('8MzoFXt7P3phCUDWLpxdxjpJu4Mo4nTy54CFhihnFW3P'),
    creator: CitizenOneCollectionCreator,
    name: 'Citizenone-dev',
    logo: require('@/assets/images/citizen-one.png'),
    rewardTokenName: 'KSE'
  }
]
