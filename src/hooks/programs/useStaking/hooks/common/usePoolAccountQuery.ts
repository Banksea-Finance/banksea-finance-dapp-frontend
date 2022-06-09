import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '@/hooks/programs/useStaking/hooks/common/useStakingProgram'
import { useRefreshController } from '@/contexts'
import { AccountFromIDL } from '@/utils/types'
import { StakingProgramIdlType } from '@/hooks/programs/useStaking/constants'

export const usePoolAccountQuery = (pool: PublicKey) => {
  const program = useStakingProgram()
  const { slowRefreshFlag } = useRefreshController()

  return useQuery<AccountFromIDL<StakingProgramIdlType, 'pool'> | undefined>(
    ['POOL_ACCOUNT', pool, slowRefreshFlag],
    async () => {
      return (await program.account.pool.fetchNullable(pool)) || undefined
    }
  )
}
