import { useQuery, UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'

const useRewardsPerDayQuery = (staker?: NFTStaker): UseQueryResult<BigNumber> => {
  return useQuery(
    ['NFT_STAKING_REWARDS_PER_DAY', staker?.pool],
    async (): Promise<BigNumber | undefined> => {
      if (!staker) return undefined

      const program = staker.program

      const poolAccount = await program.account.pool.fetch(staker.pool).catch(() => undefined)

      if (!poolAccount) {
        return Promise.reject('Failed to fetch pool account')
      }

      const secondsInYear = new BigNumber(24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/)
      const rewardPerSec = new BigNumber(poolAccount.rewardPerSec.toString())
      const totalStakingAmount = new BigNumber(poolAccount.totalStakingAmount.toString())

      const rewardsPerDay = rewardPerSec.multipliedBy(secondsInYear).div(totalStakingAmount)

      const decimals = await staker.getRewardTokenDecimals()

      return rewardsPerDay.shiftedBy(-decimals)
    },
    { refetchInterval: 5000 }
  )
}

export default useRewardsPerDayQuery
