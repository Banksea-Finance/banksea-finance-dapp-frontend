import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useRefreshController } from '@/contexts'

const usePoolBalanceQuery = (staker?: TokenStaker) => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery<BigNumber | undefined>(['pool-balance', staker?.pool, intermediateRefreshFlag], () => {
    return staker?.getPoolBalance()
  })
}

export default usePoolBalanceQuery
