import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { useStakingProgram } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { getTokenStakingDepositTokenMint } from '../../helpers/getters'

const usePoolBalanceQuery = ({ whitelist }: TokenStakingPoolConfig) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery<BigNumber | undefined>(
    ['TOKEN_STAKING_POOL_BALANCE', whitelist, intermediateRefreshFlag],
    async () => {
      if (!user) return undefined

      const tokenMint = await getTokenStakingDepositTokenMint(program, whitelist)

      const tokenAccount = await program.provider.connection.getParsedTokenAccountsByOwner(user, {
        mint: tokenMint
      })

      return new BigNumber(tokenAccount.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || '0')
    })
}

export default usePoolBalanceQuery
