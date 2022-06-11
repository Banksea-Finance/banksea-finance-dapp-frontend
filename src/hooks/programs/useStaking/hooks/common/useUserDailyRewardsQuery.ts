import { useQuery } from 'react-query'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from './useStakingProgram'
import { getPassbook } from '../../helpers/accounts'
import BigNumber from 'bignumber.js'

export const useUserDailyRewardsQuery = (pool: PublicKey, show: boolean, rewardPerStakingPerDay?: BigNumber, stakingTokenDecimals = 0) => {
  const { slowRefreshFlag } = useRefreshController()
  const { account } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery<BigNumber | undefined>(
    ['USER_DAILY_REWARDS', account, pool, show, slowRefreshFlag, rewardPerStakingPerDay],
    async () => {
      if (!account || !rewardPerStakingPerDay || !show) return undefined

      const { account: passbook } = await getPassbook({ pool, user: account, program })

      if (!passbook) return undefined

      return new BigNumber(passbook.stakingAmount.toString()).multipliedBy(rewardPerStakingPerDay).shiftedBy(-stakingTokenDecimals)
    }
  )
}
