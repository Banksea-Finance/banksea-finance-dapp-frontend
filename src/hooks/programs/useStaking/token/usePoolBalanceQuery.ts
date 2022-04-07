import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'

const usePoolBalanceQuery = (staker?: TokenStaker) => {
  return useQuery<BigNumber | undefined>(['pool-balance', staker?.pool], () => {
    return staker?.getPoolBalance()
  })
}

export default usePoolBalanceQuery
