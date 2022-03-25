import { TokenStaker } from './helpers/TokenStaker'
import { useSolanaWeb3 } from '@/contexts'
import { useMemo } from 'react'
import useStakingProgram from './useStakingProgram'
import {
  useAPRQuery,
  useAvailableRewardsQuery,
  useClaim,
  useDeposit,
  useTotalDepositedQuery,
  useUserDepositedQuery,
  useUserHistoryRewards,
  useWithdraw
} from './token'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import useUserHistoryRewardsQuery from '@/hooks/programs/useStaking/token/useUserHistoryRewardsQuery'

const useTokenStaking = (props: TokenStakingPoolConfig) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    if (!program) return undefined

    return new TokenStaker({
      ...props,
      poolName: props.currencies.map(c => c.name).join('/'),
      program,
      user: account
    })
  }, [program, props])

  const deposit = useDeposit(staker)
  const withdraw = useWithdraw(staker)
  const claim = useClaim(staker)

  const APR = useAPRQuery(staker?.pool)
  const userDeposited = useUserDepositedQuery(staker)
  const totalDeposited = useTotalDepositedQuery(staker)
  const availableRewards = useAvailableRewardsQuery(staker)
  const historyRewardsQuery = useUserHistoryRewardsQuery(staker)

  const { data: totalRewards } = useUserHistoryRewards(staker)

  return {
    deposit,
    withdraw,
    claim,
    APR,
    totalRewards,
    userDeposited,
    totalDeposited,
    availableRewards,
    historyRewardsQuery,
    program
  }
}

export { useTokenStaking }
