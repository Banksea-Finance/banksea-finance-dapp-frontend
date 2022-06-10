import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { useRefreshController, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { TokenStakingPoolConfig } from '../../constants/token'
import { getLargestTokenAccount } from '@/hooks/programs/useStaking/helpers/accounts'

const usePoolBalanceQuery = ({ depositToken }: TokenStakingPoolConfig) => {
  const { slowRefreshFlag } = useRefreshController()
  const { account: user } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()

  return useQuery<BigNumber | undefined>(
    ['TOKEN_STAKING_POOL_BALANCE', depositToken, slowRefreshFlag, user],
    async () => {
      if (!user) return undefined

      const tokenAccount = await getLargestTokenAccount(connection, user, depositToken.tokenMint)

      return new BigNumber(tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || '0')
    })
}

export default usePoolBalanceQuery
