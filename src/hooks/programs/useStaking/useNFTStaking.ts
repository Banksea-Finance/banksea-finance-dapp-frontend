import { NFTStakingPoolConfig } from './constants/nft'
import { useStakingEndTimeQuery, useUserAvailableRewardsQuery, useUserDailyRewardsQuery } from './hooks/common'
import {
  useClaim,
  useDeposit,
  useRewardsOfRarityPerDayQuery,
  useTotalDepositedQuery,
  useUserDepositedQuery,
  useWithdraw
} from './hooks/nft'
import { useCurrentSlotTime } from '@/hooks/useCurrentSlotTime'
import { useMemo } from 'react'

export const useNFTStaking = (config: NFTStakingPoolConfig) => {
  const { pool } = config

  const deposit = useDeposit(config)
  const withdraw = useWithdraw(config)
  const claim = useClaim(config)

  const { data: endTime } = useStakingEndTimeQuery(config.pool)

  const currentSlotTime = useCurrentSlotTime()

  const ended = useMemo(
    () => !!currentSlotTime && !!endTime && currentSlotTime > endTime,
    [currentSlotTime, endTime]
  )

  const RRPD = useRewardsOfRarityPerDayQuery(pool, ended)
  const totalDeposited = useTotalDepositedQuery(pool)

  const userDeposited = useUserDepositedQuery(pool)
  const userDailyRewards = useUserDailyRewardsQuery(pool, RRPD.data)
  const userAvailableRewards = useUserAvailableRewardsQuery(pool)

  return {
    deposit,
    withdraw,
    claim,
    userDeposited,
    totalDeposited,
    userDailyRewards,
    userAvailableRewards,
    RRPD,
    endTime,
    ended
  }
}
