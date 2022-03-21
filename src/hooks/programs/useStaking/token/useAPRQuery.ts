import { useQuery, UseQueryResult } from 'react-query'
import useStakingProgram from '@/hooks/programs/useStaking/useStakingProgram'
import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { useRefreshController } from '@/contexts'

const useAPRQuery = (
  pool?: PublicKey
): UseQueryResult<undefined | { APR: BigNumber; totalRewardsPerDay: BigNumber }> => {
  const { program } = useStakingProgram()
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['TOKEN_APR', program?.programId, pool, intermediateRefreshFlag],
    async (): Promise<undefined | { APR: BigNumber; totalRewardsPerDay: BigNumber }> => {
      if (!program || !pool) return undefined

      const poolAccount = await program.account.pool.fetch(pool).catch(() => undefined)

      if (!poolAccount) {
        return Promise.reject('Failed to fetch pool account')
      }

      if (poolAccount.totalStakingAmount.isZero()) {
        return undefined
      }

      const totalStakingAmount = new BigNumber(poolAccount.totalStakingAmount.toString())
      const rewardPerSec = new BigNumber(poolAccount.rewardPerSec.toString())
      const secondsInYear = new BigNumber(365 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/)

      const totalRewardsInYear = rewardPerSec.multipliedBy(secondsInYear)
      const APR = totalRewardsInYear.div(totalStakingAmount)

      return {
        APR,
        totalRewardsPerDay: APR.div(365)
      }
    },
    { refetchInterval: false }
  )
}

export default useAPRQuery
