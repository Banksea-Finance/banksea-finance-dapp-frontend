import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useUserDepositedTokenQuery = (staker?: TokenStaker) => {
  return useQuery(
    ['UserDeposits', staker?.pool],
    () => {
      if (!staker) return undefined

      return staker.getUserDeposited()
    },
    { refetchInterval: 5000, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useUserDepositedTokenQuery
