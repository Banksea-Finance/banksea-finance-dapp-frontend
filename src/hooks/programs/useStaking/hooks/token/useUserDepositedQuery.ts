import { useQuery } from 'react-query'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import BigNumber from 'bignumber.js'
import { getPassbook } from '../../helpers/accounts'
import { TokenStakingPoolConfig } from '../../constants/token'
import { getTokenDecimals, getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { useStakingProgram } from '../common'

const useUserDepositedQuery = ({ pool, whitelist }: TokenStakingPoolConfig) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery<BigNumber | undefined, any>(
    ['TOKEN_USER_DEPOSITED', user, pool, whitelist, intermediateRefreshFlag],
    async () => {
      if (!user) return undefined

      const passbook = (await getPassbook({ pool, user, program }))!

      const amount = passbook.account?.stakingAmount

      if (!amount) {
        return new BigNumber(0)
      }

      const tokenMint = await getTokenStakingDepositTokenMint(program, whitelist)
      const decimals = await getTokenDecimals(program.provider.connection, tokenMint)
      return new BigNumber(amount.toString()).shiftedBy(-decimals)
    },
  )
}

export default useUserDepositedQuery
