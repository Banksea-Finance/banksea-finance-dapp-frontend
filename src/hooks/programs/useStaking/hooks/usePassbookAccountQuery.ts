import { useQuery } from 'react-query'
import { getPassbook } from '../helpers/accounts'
import { PublicKey } from '@solana/web3.js'
import { useSolanaWeb3 } from '@/contexts'
import useStakingProgram from './useStakingProgram'

const usePassbookAccountQuery = (pool: PublicKey) => {
  const { account } = useSolanaWeb3()
  const { program } = useStakingProgram()

  return useQuery(
    ['PassbookAccount'],
    () => {
      if (!account || !program) return undefined

      return getPassbook({ pool, user: account, program })
    }, {
      refetchInterval: 5000
    }
  )
}

export default usePassbookAccountQuery
