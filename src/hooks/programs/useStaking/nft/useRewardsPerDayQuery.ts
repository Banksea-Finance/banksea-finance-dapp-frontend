import { useQuery, UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'

const useRewardsPerDayQuery = (staker?: NFTStaker): UseQueryResult<BigNumber> => {
  return useQuery(
    ['NFT_STAKING_REWARDS_PER_DAY', staker?.pool],
    async (): Promise<BigNumber | undefined> => {
      if (!staker) return undefined

      const program = staker.program

      const curSlot = await program.provider.connection.getSlot()
      const curSlotTime = (await program.provider.connection.getBlockTime(curSlot)) as number

      let prevSlot
      let prevSlotTime

      const slotOffsetBase = 3600 * 24 * 2
      let offsetFactor = 0

      do {
        offsetFactor++

        prevSlot = curSlot - slotOffsetBase * offsetFactor
        prevSlotTime = await program.provider.connection.getBlockTime(prevSlot).catch(() => undefined)
      } while (!prevSlotTime)

      const timeOffset = (curSlotTime - prevSlotTime) * 1000
      const slotPerMs = (curSlot - prevSlot) / timeOffset

      const poolAccount = await program.account.pool.fetch(staker.pool).catch(() => undefined)

      if (!poolAccount) {
        return Promise.reject('Failed to fetch pool account')
      }

      const slotInDay = 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/ * 1000 /*milliseconds*/ * slotPerMs

      const rewardsPerDay = new BigNumber(poolAccount.rewardPerSlot.toString())
        .multipliedBy(new BigNumber(slotInDay))
        .div(new BigNumber(poolAccount.totalStakingAmount.toString()))

      const decimals = await staker.getRewardTokenDecimals()

      return rewardsPerDay.shiftedBy(-decimals)
    },
    { refetchInterval: 5000 }
  )
}

export default useRewardsPerDayQuery
