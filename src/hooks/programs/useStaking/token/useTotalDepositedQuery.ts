import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useTotalDepositedQuery = (staker?: TokenStaker) => {
  return useQuery(
    ['TOKEN_totalDeposited', staker?.pool, staker?.user],
    () => {
      if (!staker) return undefined

      return staker.getTotalDeposited()
    },
    { refetchInterval: 5000, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useTotalDepositedQuery
