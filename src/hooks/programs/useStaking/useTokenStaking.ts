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

const useTokenStaking = (props: TokenStakingPoolConfig) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    if (!program || !account) return undefined

    return new TokenStaker({
      ...props,
      poolName: props.currencies.map(c => c.name).join('/'),
      program,
      user: account
    })
  }, [program, props])

  const deposit = useDeposit(staker)
  const withdraw = useWithdraw(staker)
  const harvest = useClaim(staker)

  const { data: APR } = useAPRQuery(staker?.pool)
  const { data: userDeposited } = useUserDepositedQuery(staker)
  const { data: totalDeposited } = useTotalDepositedQuery(staker)
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  const { data: totalRewards } = useUserHistoryRewards(staker)

  return {
    deposit,
    withdraw,
    harvest,
    APR,
    totalRewards,
    userDeposited,
    totalDeposited,
    availableRewards,
    program
  }
}

export { useTokenStaking }
