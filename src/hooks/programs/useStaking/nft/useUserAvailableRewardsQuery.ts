import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useRefreshController } from '@/contexts'

const useUserAvailableRewardsQuery = (staker: NFTStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(['NFT_USER_AVAILABLE_REWARDS', staker.pool, staker.user, intermediateRefreshFlag], () => {
    if (!staker?.user) return undefined

    return staker.getAvailableRewards()
  })
}

export default useUserAvailableRewardsQuery
