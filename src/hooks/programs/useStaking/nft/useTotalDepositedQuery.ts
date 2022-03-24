import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useQuery, UseQueryResult } from 'react-query'
import { useRefreshController } from '@/contexts'

const useTotalDepositedQuery = (staker?: NFTStaker): UseQueryResult<number | undefined> => {
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(['NFT_TotalDeposited', staker?.user, staker?.pool, quietRefreshFlag], async () => {
    if (!staker) return undefined

    const poolAccount = await staker.getPoolAccount()

    return poolAccount.totalStakingAmount.toNumber()
  })
}

export default useTotalDepositedQuery
