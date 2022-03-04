import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const useAvailableRewardsQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_AvailableRewards', staker?.pool, staker?.user, intermediateRefreshFlag],
    () => {
      if (!staker) return undefined

      return staker.getAvailableRewards()
    },
    { keepPreviousData: true, refetchInterval: false }
  )
}

export default useAvailableRewardsQuery
