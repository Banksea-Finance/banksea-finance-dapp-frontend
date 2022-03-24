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
    poolAddress: new PublicKey('9ug4pBAT18tQeQWcvPogXRk7Ma35qRnBpNSCMHMPRh22'),
    whitelist: new PublicKey('8MzoFXt7P3phCUDWLpxdxjpJu4Mo4nTy54CFhihnFW3P'),
    creator: new PublicKey('A7aksxoZFvnMy58ing8M4Wbuu8XweaRonf6PGqZ7Fyso'),
    name: 'Citizenone-dev',
    logo: 'https://hn52zxyctuoztwo2oxnt3pxqmmcdhwkbqensvb2mbuswf7oxpm.arweave.net/O3us3wKdHZnZ2nXbPb7w_YwQz2UGBGyqHTA0lYv3Xe8?ext=png',
    rewardTokenName: 'KSE'
  }
]
