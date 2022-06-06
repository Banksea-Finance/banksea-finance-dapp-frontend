import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from './index'
import { getTokenDecimals } from '../../helpers/getters'

export const useTokenDecimalsQuery = (tokenMint: PublicKey) => {
  const program = useStakingProgram()

  return useQuery<number>(['TOKEN_DECIMALS', tokenMint], () => {
    return getTokenDecimals(program.provider.connection, tokenMint)
  })
}
