import { NFTStakingPoolConfig } from './constants/nft'
import { useUserAvailableRewardsQuery, useUserClaimedRewardsQuery } from './hooks/common'
import {
  useClaim,
  useDeposit,
  useRewardsPerDayQuery,
  useTotalDepositedQuery,
  useUserDepositedQuery,
  useWithdraw
} from './hooks/nft'

export const useNFTStaking = (config: NFTStakingPoolConfig) => {
  const { pool } = config

  const deposit = useDeposit(config)
  const withdraw = useWithdraw(config)
  const claim = useClaim(config)

  const rewardsPerDay = useRewardsPerDayQuery(pool)
  const totalDeposited = useTotalDepositedQuery(pool)

  const userDeposited = useUserDepositedQuery(pool)
  const userClaimedRewards = useUserClaimedRewardsQuery(pool)
  const userAvailableRewards = useUserAvailableRewardsQuery(pool)

  return {
    deposit,
    withdraw,
    claim,
    userDeposited,
    totalDeposited,
    userClaimedRewards,
    userAvailableRewards,
    rewardsPerDay
  }
}
