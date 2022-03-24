import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useUserHistoryRewardsQuery = (staker?: TokenStaker) => {
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(['TOKEN_USER_HISTORY_REWARDS', staker?.user, staker?.pool, quietRefreshFlag], () => {
    if (!staker) return undefined

    return staker.getHistoryTotalRewards()
  })
}

export default useUserHistoryRewardsQuery
