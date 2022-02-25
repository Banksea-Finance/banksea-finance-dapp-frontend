import { useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { ParsedAccountData, PublicKey, TokenAmount } from '@solana/web3.js'
import {
  loadMetadata,
  MetadataResult,
  MetaplexMetadataAccountDataCore
} from '@/hooks/programs/useCandyMachine/helpers/metadata'
import { useQuery, UseQueryResult } from 'react-query'
import { BankseaNftCollection, TOKEN_PROGRAM_ID } from '@/hooks/programs/useCandyMachine/helpers/constant'

export interface MyCitizenOne extends MetadataResult {
  data: MetaplexMetadataAccountDataCore
}

const belongsToCollection = (data: MetadataResult, collectionConfig: BankseaNftCollection) => {
  return data?.creators?.[0]?.address === collectionConfig.creator.toBase58()
}

export const useCitizenOnesWithoutRaritiesQuery = (collectionConfig: BankseaNftCollection): UseQueryResult<MetadataResult[]> => {
  const { connection } = useSolanaConnectionConfig()
  const { account } = useSolanaWeb3()

  return useQuery(
    ['CitizenOnesWithoutRarities', account],
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

      const tokens: MetadataResult[] = (await Promise.all(mints.map(pk => loadMetadata(connection, pk)))).filter(o => o !== undefined) as MetadataResult[]

      return tokens.filter(token => belongsToCollection(token, collectionConfig))
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false
    }
  )
}

const useMyCitizenOnesQuery = (): UseQueryResult<MyCitizenOne[]> => {
  // const { data: tokens } = useCitizenOnesWithoutRaritiesQuery()

  return useQuery(
    ['MyCitizenOnes', /*tokens*/],
    (): MyCitizenOne[] | MetadataResult[] | undefined => {
      return undefined
      // return tokens?.map(token => ({
      //   ...token,
      //   data: {
      //     ...token.data,
      //     attributes: token.data?.attributes
      //   }
      // })) as MyCitizenOne[]
    }
  )
}


export default useMyCitizenOnesQuery
