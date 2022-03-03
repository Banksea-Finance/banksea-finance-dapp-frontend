import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'

const useUserHistoryRewardsQuery = (staker?: NFTStaker) => {
  return useQuery(['NFT_UserHistoryRewards', staker?.user, staker?.pool], () => {
    if (!staker) return undefined

    return staker.getHistoryTotalRewards()
  })
}

export default useUserHistoryRewardsQuery
