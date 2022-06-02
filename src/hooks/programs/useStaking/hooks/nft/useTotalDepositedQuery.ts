import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'

const useTotalDepositedQuery = (pool: PublicKey) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery<number>(['NFT_TOTAL_DEPOSITED', pool, intermediateRefreshFlag], async () => {
    const poolAccount = await program.account.pool.fetch(pool)

    return poolAccount.totalDepositAmount.toNumber()
  })
}

export default useTotalDepositedQuery
