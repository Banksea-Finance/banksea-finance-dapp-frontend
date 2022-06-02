import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import BigNumber from 'bignumber.js'
import { useStakingProgram } from '../common'
import { getTokenDecimals, getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { TokenStakingPoolConfig } from '../../constants/token'

const useTotalDepositedQuery = ({ pool, whitelist }: TokenStakingPoolConfig) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery<BigNumber | undefined>(
    ['TOKEN_TOTAL_DEPOSITED', pool, whitelist, intermediateRefreshFlag],
    async () => {
      const account = await program.account.pool.fetchNullable(pool)

      if (!account) return undefined

      const tokenMint = await getTokenStakingDepositTokenMint(program, whitelist)
      const decimals = await getTokenDecimals(program.provider.connection, tokenMint)

      return new BigNumber(account.totalDepositAmount.toString()).shiftedBy(-decimals)
    }
  )
}

export default useTotalDepositedQuery
