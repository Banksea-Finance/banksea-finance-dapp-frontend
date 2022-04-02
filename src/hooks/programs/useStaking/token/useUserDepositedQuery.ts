import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const useUserDepositedQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_USER_DEPOSITED', staker?.pool, staker?.user, intermediateRefreshFlag],
    () => {
      if (!staker) return undefined

      return staker.getUserDeposited()
    },
    { refetchInterval: false, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useUserDepositedQuery
