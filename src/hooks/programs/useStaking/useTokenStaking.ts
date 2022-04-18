import { TokenStaker } from './helpers/TokenStaker'
import { useSolanaWeb3 } from '@/contexts'
import { useMemo } from 'react'
import useStakingProgram from './useStakingProgram'
import {
  useAPRQuery,
  useUserAvailableRewardsQuery,
  useClaim,
  useDeposit,
  useTotalDepositedQuery,
  useUserClaimedRewardsQuery,
  useUserDepositedQuery,
  useWithdraw, usePoolBalanceQuery
} from './token'
import { TokenStakingPoolConfig } from './constants/token'

export const useTokenStaking = (props: TokenStakingPoolConfig) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    return new TokenStaker({
      ...props,
      poolName: props.currencies.map(c => c.name).join('/'),
      program,
      user: account
    })
  }, [program, props, account])

  const deposit = useDeposit(staker)
  const withdraw = useWithdraw(staker)
  const claim = useClaim(staker)

  const APR = useAPRQuery(staker?.pool)
  const totalDeposited = useTotalDepositedQuery(staker)
  const userDeposited = useUserDepositedQuery(staker)
  const userAvailableRewards = useUserAvailableRewardsQuery(staker)
  const userClaimedRewards = useUserClaimedRewardsQuery(staker)
  const poolBalance = usePoolBalanceQuery(staker)

  return {
    deposit,
    withdraw,
    claim,
    APR,
    poolBalance,
    userDeposited,
    totalDeposited,
    userAvailableRewards,
    userClaimedRewards,
    program
  }
}
