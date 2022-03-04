import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useUserHistoryRewards = (staker?: TokenStaker) => {
  return useQuery(
    ['TOKEN_TotalRewards', staker?.pool, staker?.user],
    () => {
      if (!staker) return undefined

      return staker.getHistoryTotalRewards()
    },
    { keepPreviousData: true }
  )
}

export default useUserHistoryRewards
