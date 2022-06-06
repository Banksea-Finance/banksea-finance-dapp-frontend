import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from './useStakingProgram'
import { useRefreshController } from '@/contexts'

export const useStakingEndTimeQuery = (pool: PublicKey) => {
  const program = useStakingProgram()
  const { slowRefreshFlag } = useRefreshController()

  return useQuery<number | undefined>(['STAKING_END_TIME', pool, slowRefreshFlag], () => {
    return program.account.pool.fetchNullable(pool).then(r => {
      if (r === null) return undefined

      return r.endSec.toNumber()
    })
  })
}
