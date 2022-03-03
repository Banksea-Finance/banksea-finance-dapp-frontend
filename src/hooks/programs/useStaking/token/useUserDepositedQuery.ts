import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const useUserDepositedQuery = (staker?: TokenStaker) => {
  return useQuery(
    ['TOKEN_UserDeposits', staker?.pool, staker?.user],
    () => {
      if (!staker) return undefined

      return staker.getUserDeposited()
    },
    { refetchInterval: 5000, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useUserDepositedQuery
