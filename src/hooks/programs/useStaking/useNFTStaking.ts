import { NFTStakingPoolConfig } from './constants/nft'
import { usePoolAccountQuery, useUserAvailableRewardsQuery, useUserDailyRewardsQuery } from './hooks/common'
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

  const currentSlotTime = useCurrentSlotTime()

  const { data: poolAccount } = usePoolAccountQuery(config.pool)

  const ended = useMemo(() => {
    if (!poolAccount) return false

    const endTime = poolAccount.endSec.toNumber()

    return !!currentSlotTime && !!endTime && currentSlotTime > endTime
  }, [currentSlotTime, poolAccount])

  const started = useMemo(() => {
    if (!poolAccount) return false

    const startTime = poolAccount.startSec.toNumber()

    return !!currentSlotTime && !!startTime && currentSlotTime > startTime
  }, [currentSlotTime, poolAccount])

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
    poolAccount,
    ended,
    started
  }
}
