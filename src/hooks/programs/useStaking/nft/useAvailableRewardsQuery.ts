import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useRefreshController } from '@/contexts'

const useAvailableRewardsQuery = (staker?: NFTStaker) => {
  const { slowRefreshFlag } = useRefreshController()

  return useQuery(['NFT_AVAILABLE_REWARDS', staker?.pool, staker?.user, slowRefreshFlag], () => {
    if (!staker) return undefined

    return staker.getAvailableRewards()
  })
}

export default useAvailableRewardsQuery
