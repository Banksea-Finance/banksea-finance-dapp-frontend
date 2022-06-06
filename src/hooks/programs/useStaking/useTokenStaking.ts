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
import {
  useStakingEndTimeQuery,
  useTokenDecimalsQuery,
  useUserAvailableRewardsQuery,
  useUserDailyRewardsQuery
} from './hooks/common'
import { useCurrentSlotTime } from '@/hooks/useCurrentSlotTime'
import { useMemo } from 'react'

export const useTokenStaking = (config: TokenStakingPoolConfig) => {
  const deposit = useDeposit(config)
  const withdraw = useWithdraw(config)
  const claim = useClaim(config)
  const compound = useCompound(config)

  const { data: endTime } = useStakingEndTimeQuery(config.pool)

  const currentSlotTime = useCurrentSlotTime()

  const ended = useMemo(
    () => !!currentSlotTime && !!endTime && currentSlotTime > endTime,
    [currentSlotTime, endTime]
  )

  const APR = useAPRQuery(config, ended)
  const totalDeposited = useTotalDepositedQuery(config)
  const userDeposited = useUserDepositedQuery(config)
  const poolBalance = usePoolBalanceQuery(config)

  const { data: stakingTokenDecimals } = useTokenDecimalsQuery(config.depositToken.tokenMint)

  const userAvailableRewards = useUserAvailableRewardsQuery(config.pool)
  const userDailyRewards = useUserDailyRewardsQuery(config.pool, APR?.data?.rewardsPerDay, stakingTokenDecimals)

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
    userDailyRewards,
    endTime,
    ended
  }
}
