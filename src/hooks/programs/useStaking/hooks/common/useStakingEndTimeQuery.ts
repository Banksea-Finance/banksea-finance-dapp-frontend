import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from './useStakingProgram'

export const useStakingEndTimeQuery = (pool: PublicKey) => {
  const program = useStakingProgram()

  return useQuery<number | undefined>(['STAKING_END_TIME', pool], () => {
    return program.account.pool.fetchNullable(pool).then(r => {
      if (r === null) return undefined

      return r.endSec.toNumber()
    })
  })
}
