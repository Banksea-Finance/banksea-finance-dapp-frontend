import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'
import { getTokenDecimals, getTokenStakingDepositTokenMint } from '../../helpers/getters'

const useDepositTokenDecimalsQuery = (whitelist: PublicKey) => {
  const program = useStakingProgram()

  return useQuery<number>(
    ['DEPOSITED_TOKEN_DECIMALS', whitelist],
    () => {
      return getTokenStakingDepositTokenMint(program, whitelist)
        .then(mint => getTokenDecimals(program.provider.connection, mint))
    }
  )
}

export default useDepositTokenDecimalsQuery
