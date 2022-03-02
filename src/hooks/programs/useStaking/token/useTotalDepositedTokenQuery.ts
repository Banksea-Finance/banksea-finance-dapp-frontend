import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useTotalDepositedTokenQuery = (staker?: TokenStaker) => {
  return useQuery(
    ['totalDeposited', staker?.pool],
    () => {
      if (!staker) return undefined

      return staker.getTotalDeposited()
    },
    { refetchInterval: 5000, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useTotalDepositedTokenQuery
