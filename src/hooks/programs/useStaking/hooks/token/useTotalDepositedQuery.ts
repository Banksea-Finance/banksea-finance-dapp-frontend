import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts'
import BigNumber from 'bignumber.js'
import { useStakingProgram } from '../common'
import { getTokenDecimals } from '../../helpers/getters'
import { TokenStakingPoolConfig } from '../../constants/token'

const useTotalDepositedQuery = ({ pool, depositToken }: TokenStakingPoolConfig) => {
  const { slowRefreshFlag } = useRefreshController()
  const program = useStakingProgram()

  return useQuery<BigNumber | undefined>(
    ['TOKEN_TOTAL_DEPOSITED', pool, slowRefreshFlag, depositToken.tokenMint.toBase58()],
    async () => {
      const account = await program.account.pool.fetchNullable(pool)

      if (!account) return undefined

      const decimals = await getTokenDecimals(program.provider.connection, depositToken.tokenMint)

      return new BigNumber(account.totalDepositAmount.toString()).shiftedBy(-decimals)
    }
  )
}

export default useTotalDepositedQuery
