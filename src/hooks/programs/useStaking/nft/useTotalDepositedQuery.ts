import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { useQuery, UseQueryResult } from 'react-query'

const useTotalDepositedQuery = (staker?: NFTStaker): UseQueryResult<number | undefined> => {
  return useQuery(['NFT_TotalDeposited', staker?.user, staker?.pool], async () => {
    if (!staker) return undefined

    const poolAccount = await staker.getPoolAccount()

    return poolAccount.totalStakingAmount.toNumber()
  })
}

export default useTotalDepositedQuery
