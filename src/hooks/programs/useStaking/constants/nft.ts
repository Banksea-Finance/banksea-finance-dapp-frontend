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
    logo: 'https://content.solsea.io/files/thumbnail/1643474033004-292668735.png',
    rewardTokenName: 'KSE'
  }
]
