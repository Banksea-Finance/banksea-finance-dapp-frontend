import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import useStakingProgram from './useStakingProgram'

const usePoolAccountQuery = (pool: PublicKey) => {
  const { program } = useStakingProgram()

  return useQuery(
    ['PoolAccount'],
    () => {
      if (!program) return undefined

      return program.account.pool.fetchNullable(pool)
    },
    {
      refetchInterval: 5000
    }
  )
}

export default usePoolAccountQuery
