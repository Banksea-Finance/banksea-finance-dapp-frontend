import { useQuery } from 'react-query'
import { loadMetadata, MetadataResult } from '@/utils/metaplex/metadata'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { PublicKey } from '@solana/web3.js'
import { useStakingProgram } from '../common'
import { getPassbook } from '../../helpers/accounts'

const useUserDepositedQuery = (pool: PublicKey) => {
  const { intermediateRefreshFlag } = useRefreshController()
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  return useQuery<MetadataResult[] | undefined, any>(
    ['NFT_USER_DEPOSITED', user, pool, intermediateRefreshFlag],
    async () => {
      if (!user) return undefined

      const passbook = await getPassbook({ pool, user, program })

      const allAssets = await program.account.asset.all([
        {
          memcmp: {
            offset: 8, // need to prepend 8 bytes for anchor's disc
            bytes: passbook.address.toBase58()
          }
        }
      ])

      if (!allAssets) return undefined

      const tokenMints = allAssets.map(o => o.account.mint)

      return (await Promise.all(tokenMints.map(mint => loadMetadata(program.provider.connection, mint)))).filter(
        o => o !== undefined
      ) as MetadataResult[]
    },
    { refetchInterval: false }
  )
}

export default useUserDepositedQuery
