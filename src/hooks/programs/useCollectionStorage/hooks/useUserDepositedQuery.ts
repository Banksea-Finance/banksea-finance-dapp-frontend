import { useQuery } from 'react-query'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { getPassbookSigner } from '../utils'
import { CollectionStoragePoolAddress } from '../constants'
import { useCollectionStorageProgram } from './useCollectionStorageProgram'
import { loadMetadata, MetadataResult } from '@/utils/metaplex/metadata'

export const useUserDepositedQuery = () => {
  const { account } = useSolanaWeb3()
  const pool = CollectionStoragePoolAddress
  const program = useCollectionStorageProgram()
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(
    ['COLLECTION_STORAGE_USER_DEPOSITED', account, program.programId, quietRefreshFlag],
    async () => {
      if (!account) return undefined

      const [passbook] = getPassbookSigner(pool, account)

      const allAssets = await program.account.asset.all([{
        memcmp: {
          offset: 8, // need to prepend 8 bytes for anchor's disc
          bytes: passbook.toBase58()
        }
      }])

      const tokenMints = allAssets.map(o => o.account.mint)

      return (await Promise.all(tokenMints.map(mint => loadMetadata(program.provider.connection, mint)))).filter(
        o => o !== undefined
      ) as MetadataResult[]
    }
  )
}

