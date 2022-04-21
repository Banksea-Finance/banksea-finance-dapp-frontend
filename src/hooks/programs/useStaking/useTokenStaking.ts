import {
  useAPRQuery,
  useClaim,
  useCompound,
  useDeposit,
  usePoolBalanceQuery,
  useTotalDepositedQuery,
  useUserDepositedQuery,
  useWithdraw
} from './hooks/token'
import { TokenStakingPoolConfig } from './constants/token'
import { useStakingProgram, useUserAvailableRewardsQuery, useUserClaimedRewardsQuery } from './hooks/common'

export const useTokenStaking = (config: TokenStakingPoolConfig) => {
  const program = useStakingProgram()

  const deposit = useDeposit(config)
  const withdraw = useWithdraw(config)
  const claim = useClaim(config)
  const compound = useCompound(config)

  const APR = useAPRQuery(config)
  const totalDeposited = useTotalDepositedQuery(config)
  const userDeposited = useUserDepositedQuery(config)
  const poolBalance = usePoolBalanceQuery(config)

  const userAvailableRewards = useUserAvailableRewardsQuery(config.pool)
  const userClaimedRewards = useUserClaimedRewardsQuery(config.pool)

  return {
    deposit,
    withdraw,
    claim,
    compound,
    APR,
    poolBalance,
    userDeposited,
    totalDeposited,
    userAvailableRewards,
    userClaimedRewards,
    program
  }
}
