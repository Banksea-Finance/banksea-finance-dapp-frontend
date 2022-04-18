import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useUserClaimedRewardsQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(['TOKEN_USER_CLAIMED_REWARDS', staker?.user, staker?.pool, intermediateRefreshFlag], () => {
    if (!staker?.user) return undefined

    return staker.getClaimedRewards()
  })
}

export default useUserClaimedRewardsQuery
