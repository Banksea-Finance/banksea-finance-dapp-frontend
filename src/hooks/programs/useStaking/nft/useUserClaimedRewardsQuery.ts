import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useRefreshController } from '@/contexts'

const useUserClaimedRewardsQuery = (staker: NFTStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(['NFT_USER_CLAIMED_REWARDS', staker.user, staker.pool, intermediateRefreshFlag], () => {
    if (!staker.user) return undefined

    return staker.getClaimedRewards()
  })
}

export default useUserClaimedRewardsQuery
