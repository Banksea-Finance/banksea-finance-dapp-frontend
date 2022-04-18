import { NFTStakingPoolConfig } from './constants/nft'
import { useMemo } from 'react'
import useStakingProgram from './useStakingProgram'
import { useSolanaWeb3 } from '@/contexts'
import {
  useUserAvailableRewardsQuery,
  useClaim,
  useDeposit,
  useRewardsPerDayQuery,
  useTotalDepositedQuery,
  useUserClaimedRewardsQuery,
  useUserDepositedQuery,
  useWithdraw
} from './nft'
import { NFTStaker } from './helpers/NFTStaker'

export const useNFTStaking = (props: NFTStakingPoolConfig) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    return new NFTStaker({
      ...props,
      poolName: props.name,
      program,
      user: account
    })
  }, [program, props, account])

  const deposit = useDeposit(staker)
  const withdraw = useWithdraw(staker)
  const claim = useClaim(staker)

  const rewardsPerDay = useRewardsPerDayQuery(staker)
  const totalDeposited = useTotalDepositedQuery(staker)

  const userDeposited = useUserDepositedQuery(staker)
  const userClaimedRewards = useUserClaimedRewardsQuery(staker)
  const userAvailableRewards = useUserAvailableRewardsQuery(staker)

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
