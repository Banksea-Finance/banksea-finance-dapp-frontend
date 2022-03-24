import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useRefreshController } from '@/contexts'

const useUserHistoryRewardsQuery = (staker?: NFTStaker) => {
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(['NFT_UserHistoryRewards', staker?.user, staker?.pool, quietRefreshFlag], () => {
    if (!staker) return undefined

    return staker.getHistoryTotalRewards()
  })
}

export default useUserHistoryRewardsQuery
