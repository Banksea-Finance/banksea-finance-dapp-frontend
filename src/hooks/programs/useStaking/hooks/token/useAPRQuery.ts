import { useQuery, UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'
import { useRefreshController } from '@/contexts'
import { TokenStakingPoolConfig } from '../../constants/token'
import { useStakingProgram } from '../common'

const useAPRQuery = (
  { pool }: TokenStakingPoolConfig,
  ended: boolean
): UseQueryResult<undefined | { APR: BigNumber; totalRewardsPerDay: BigNumber }> => {
  const { intermediateRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery(
    ['TOKEN_APR', program.programId, pool, intermediateRefreshFlag, ended],
    async (): Promise<undefined | { APR: BigNumber; totalRewardsPerDay: BigNumber }> => {
      if (!pool || ended) return undefined

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
