import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const useUserAvailableRewardsQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_USER_AVAILABLE_REWARDS', staker?.pool, staker?.user, intermediateRefreshFlag],
    () => {
      if (!staker) return undefined

      return staker.getAvailableRewards()
    },
  )
}

export default useUserAvailableRewardsQuery
