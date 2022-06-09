import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'

const useTotalDepositedQuery = (pool: PublicKey) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery<number | undefined>(['NFT_TOTAL_DEPOSITED', pool, intermediateRefreshFlag], async () => {
    const account = await program.account.pool.fetchNullable(pool)

    return account?.totalDepositAmount.toNumber()
  })
}

export default useTotalDepositedQuery
