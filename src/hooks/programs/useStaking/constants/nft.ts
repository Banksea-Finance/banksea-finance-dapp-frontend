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
    poolAddress: new PublicKey('53PMPQeXZc6axm3F1c99c1PaFinU42dJkpbAVyW1dMug'),
    whitelist: new PublicKey('81LwoAGtqZFgfegwWLTmqpJYgENp4vEaUVpC8Sv9KPwP'),
    creator: new PublicKey('A7aksxoZFvnMy58ing8M4Wbuu8XweaRonf6PGqZ7Fyso'),
    name: 'Citizenone-dev',
    logo: 'https://hn52zxyctuoztwo2oxnt3pxqmmcdhwkbqensvb2mbuswf7oxpm.arweave.net/O3us3wKdHZnZ2nXbPb7w_YwQz2UGBGyqHTA0lYv3Xe8?ext=png',
    rewardTokenName: 'KSE'
  }
]
