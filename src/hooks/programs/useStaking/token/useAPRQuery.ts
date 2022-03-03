import { useQuery, UseQueryResult } from 'react-query'
import useStakingProgram from '@/hooks/programs/useStaking/useStakingProgram'
import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'

const useAPRQuery = (pool?: PublicKey): UseQueryResult<BigNumber> => {
  const { program } = useStakingProgram()

  return useQuery(
    ['TOKEN_APR', program?.programId, pool],
    async (): Promise<BigNumber | undefined> => {
      if (!program || !pool) return undefined

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

      const poolAccount = await program.account.pool.fetch(pool).catch(() => undefined)

      if (!poolAccount) {
        return Promise.reject('Failed to fetch pool account')
      }

      const slotInYear =
        365 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/ * 1000 /*milliseconds*/ * slotPerMs

      const totalRewardsInYear = new BigNumber(poolAccount.rewardPerSlot.toString()).multipliedBy(
        new BigNumber(slotInYear)
      )

      return totalRewardsInYear.div(new BigNumber(poolAccount.totalStakingAmount.toString()))
    },
    { refetchInterval: 5000 }
  )
}

export default useAPRQuery
