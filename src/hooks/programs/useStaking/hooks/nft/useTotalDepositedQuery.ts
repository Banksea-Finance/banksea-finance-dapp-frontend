import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'

const useTotalDepositedQuery = (pool: PublicKey) => {
  const { quietRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery<number>(
    ['NFT_TOTAL_DEPOSITED', pool, quietRefreshFlag],
    async () => {
      const poolAccount = await program.account.pool.fetch(pool)

      return poolAccount.totalStakingAmount.toNumber()
    }
  )
}

export default useTotalDepositedQuery
