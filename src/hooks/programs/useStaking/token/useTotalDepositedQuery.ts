import { useQuery } from 'react-query'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const useTotalDepositedQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_totalDeposited', staker?.pool, staker?.user, intermediateRefreshFlag],
    () => {
      if (!staker) return undefined

      return staker.getTotalDeposited()
    },
    { refetchInterval: false, refetchOnWindowFocus: false, keepPreviousData: true }
  )
}

export default useTotalDepositedQuery
