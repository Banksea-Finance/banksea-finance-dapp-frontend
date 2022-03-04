import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useMemo } from 'react'
import useStakingProgram from '@/hooks/programs/useStaking/useStakingProgram'
import { useSolanaWeb3 } from '@/contexts'
import {
  useAvailableRewardsQuery,
  useClaim,
  useDeposit,
  useRewardsPerDayQuery,
  useTotalDepositedQuery,
  useUserDepositedQuery,
  useUserHistoryRewardsQuery,
  useWithdraw
} from '@/hooks/programs/useStaking/nft'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'

const useNFTStaking = (props: NFTStakingPoolConfig) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()

  const staker = useMemo(() => {
    if (!program || !account) return undefined

    return new NFTStaker({
      ...props,
      poolName: props.name,
      program,
      user: account
    })
  }, [program, props])

  const deposit = useDeposit(staker)
  const withdraw = useWithdraw(staker)
  const claim = useClaim(staker)
  const { data: totalDeposited } = useTotalDepositedQuery(staker)
  const userDeposited = useUserDepositedQuery(staker)
  const { data: userTotalRewards } = useUserHistoryRewardsQuery(staker)
  const { data: rewardsPerDay } = useRewardsPerDayQuery(staker)
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  return {
    deposit,
    withdraw,
    claim,
    userDeposited,
    totalDeposited,
    userTotalRewards,
    availableRewards,
    rewardsPerDay
  }
}

export default useNFTStaking
