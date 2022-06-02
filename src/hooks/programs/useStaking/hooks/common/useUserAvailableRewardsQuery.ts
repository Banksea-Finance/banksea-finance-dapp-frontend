import { useQuery } from 'react-query'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { getAvailableRewards } from '../../helpers/getters'
import { useStakingProgram } from './useStakingProgram'

export const useUserAvailableRewardsQuery = (pool: PublicKey) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery(['USER_AVAILABLE_REWARDS', pool, user, intermediateRefreshFlag], () => {
    if (!user) return undefined

    return getAvailableRewards({ program, pool, user })
  })
}
