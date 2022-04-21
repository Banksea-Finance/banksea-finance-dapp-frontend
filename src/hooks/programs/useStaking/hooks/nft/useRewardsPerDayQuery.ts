import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'
import { getRewardTokenDecimals } from '../../helpers/getters'
import { useRefreshController } from '@/contexts'

const useRewardsPerDayQuery = (pool: PublicKey) => {
  const program = useStakingProgram()

  const { slowRefreshFlag } = useRefreshController()

  return useQuery<BigNumber | undefined>(['NFT_STAKING_REWARDS_PER_DAY', pool, slowRefreshFlag], async () => {
    const poolAccount = await program.account.pool.fetchNullable(pool)

    if (!poolAccount) return undefined

    const secondsInDay = new BigNumber(24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/)
    const rewardPerSec = new BigNumber(poolAccount.rewardPerSec.toString())
    const totalStakingAmount = new BigNumber(poolAccount.totalStakingAmount.toString())

    const rewardsPerDay = rewardPerSec.multipliedBy(secondsInDay).div(totalStakingAmount)

    if (!rewardsPerDay.isFinite()) {
      return undefined
    }

    const decimals = await getRewardTokenDecimals({ program, pool })

    return rewardsPerDay.shiftedBy(-decimals)
  })
}

export default useRewardsPerDayQuery
