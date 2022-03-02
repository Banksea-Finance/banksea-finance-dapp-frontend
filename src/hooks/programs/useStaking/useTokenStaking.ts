import { TokenStaker } from './helpers/TokenStaker'
import { useSolanaWeb3 } from '@/contexts'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import useStakingProgram from './useStakingProgram'
import {
  useTokenDeposit,
  useTokenHarvest,
  useTokenStakingAPYQuery,
  useTokenWithdraw,
  useTotalDepositedTokenQuery,
  useUserDepositedTokenQuery
} from './token'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'

export type UseStakingProps = TokenStakingPoolConfig & {
  type: 'token' | 'nft'
}

const useTokenStaking = (props: UseStakingProps) => {
  const { type } = props
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    if (!program || !account) return undefined

    return new TokenStaker({
      ...props,
      poolName: props.currencies.map(c => c.name).join('/'),
      program,
      user: account,
      rewardWallet: account
    })
  }, [program, props])

  const deposit = type === 'token' ? useTokenDeposit(staker) : () => {}
  const withdraw = type === 'token' ? useTokenWithdraw(staker) : () => {}
  const harvest = type === 'token' ? useTokenHarvest(staker) : () => {}

  const { data: APY } = useTokenStakingAPYQuery(staker?.pool)
  const { data: userDeposited } = useUserDepositedTokenQuery(staker)
  const { data: totalDeposited } = useTotalDepositedTokenQuery(staker)

  const { data: totalRewards } = useQuery(['totalRewards', staker?.pool], async () => {
    if (!staker) return undefined

    const rewards = await staker.getHistoryTotalRewards()

    const decimals = await staker.getRewardTokenDecimals()

    return rewards.shiftedBy(-decimals)
  })

  return {
    deposit,
    withdraw,
    harvest,
    APY,
    totalRewards,
    userDeposited,
    totalDeposited,
    program
  }
}

export { useTokenStaking }
