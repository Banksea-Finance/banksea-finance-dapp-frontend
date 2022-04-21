import { useQuery } from 'react-query'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import useStakingProgram from './useStakingProgram'
import { getClaimedRewards } from '../../helpers/getters'

const useUserClaimedRewardsQuery = (pool: PublicKey) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const { account } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery(['USER_CLAIMED_REWARDS', account, pool, intermediateRefreshFlag], () => {
    if (!account) return undefined

    return getClaimedRewards({
      user: account,
      program,
      pool
    })
  })
}

export default useUserClaimedRewardsQuery
