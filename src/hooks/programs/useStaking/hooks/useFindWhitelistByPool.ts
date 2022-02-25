import { PublicKey } from '@solana/web3.js'
import { TOKEN_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/token'

const useFindWhitelistByPool = (poolAddress: PublicKey) => {
  // TODO:
  const whitelist = TOKEN_STAKING_POOLS.find(pool => pool.poolAddress === poolAddress)?.whitelists[0]

  return {
    whitelist
  }
}

export default useFindWhitelistByPool
