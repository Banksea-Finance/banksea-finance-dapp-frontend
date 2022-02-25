import useTokenDeposit from './token/useTokenDeposit'
import { PublicKey } from '@solana/web3.js'
import {
  useAPYQuery,
  useFindWhitelistByPool,
  useStakingProgram,
  useTotalDepositsQuery,
  useUserDepositsQuery,
  useUserRewardsQuery
} from './hooks'

export type UseStakingProps = {
  type: 'token' | 'nft'
  poolAddress: PublicKey
}

const useStaking = (props: UseStakingProps) => {
  const { type, poolAddress } = props
  const { program } = useStakingProgram()

  const { whitelist } = useFindWhitelistByPool(poolAddress)
  const deposit = type === 'token' ? useTokenDeposit({ poolAddress, whitelistAddress: whitelist }) : () => {}
  const withdraw = () => {}

  const { data: APY } = useAPYQuery()
  const { data: userRewards } = useUserRewardsQuery()
  const userDeposit = useUserDepositsQuery(poolAddress)
  const totalDeposits = useTotalDepositsQuery(poolAddress)

  return {
    deposit,
    withdraw,
    APY,
    userRewards,
    userDeposit,
    totalDeposits,
    stakingProgram: program
  }
}

export default useStaking
