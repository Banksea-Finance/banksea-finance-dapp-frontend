import { useQuery } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useRefreshController } from '@/contexts'

const useAvailableRewardsQuery = (staker?: NFTStaker) => {
  const { fastRefreshFlag } = useRefreshController()

  return useQuery(['NFT_AvailableRewards', staker?.pool, staker?.user, fastRefreshFlag], () => {
    if (!staker) return undefined

    return staker.getAvailableRewards()
  })
}

export default useAvailableRewardsQuery
