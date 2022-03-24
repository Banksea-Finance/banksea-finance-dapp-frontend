import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const useUserHistoryRewards = (staker?: TokenStaker) => {
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_TotalRewards', staker?.pool, staker?.user, quietRefreshFlag],
    () => {
      if (!staker) return undefined

      return staker.getHistoryTotalRewards()
    },
    { keepPreviousData: true }
  )
}

export default useUserHistoryRewards
