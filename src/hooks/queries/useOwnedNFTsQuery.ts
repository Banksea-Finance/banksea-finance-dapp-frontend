import { TOKEN_PROGRAM_ID } from '@/utils/metaplex/constant'
import { useQuery, UseQueryResult } from 'react-query'
import { loadMetadata, MetadataResult } from '@/utils/metaplex/metadata'
import { useRefreshController, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { ParsedAccountData, PublicKey, TokenAmount } from '@solana/web3.js'

const belongsToCollection = (data: MetadataResult, creator: PublicKey) => {
  return data?.creators?.[0]?.address === creator.toBase58()
}

export const useOwnedNFTsQuery = (creator: PublicKey): UseQueryResult<MetadataResult[]> => {
  const { connection } = useSolanaConnectionConfig()
  const { account } = useSolanaWeb3()
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['OwnedNFTs', account, creator, intermediateRefreshFlag],
    async (): Promise<MetadataResult[]> => {
      if (!account || !connection) {
        return []
      }

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        account, { programId: TOKEN_PROGRAM_ID }
      ).then(r => r.value.map(o => o.account.data))

      const isNFTAccount = (account: ParsedAccountData) => {
        const tokenAmount: TokenAmount = account.parsed.info.tokenAmount
        return tokenAmount && (tokenAmount.amount === '1' && tokenAmount.decimals === 0)
      }

      const NFTAccounts = tokenAccounts.filter(isNFTAccount)

      const mints = NFTAccounts.map(acc => new PublicKey(acc.parsed.info.mint))

      const tokens: MetadataResult[] = (await Promise.all(mints.map(mint => loadMetadata(connection, mint)))).filter(o => o !== undefined) as MetadataResult[]

      return tokens.filter(token => belongsToCollection(token, creator))
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false
    }
  )
}
