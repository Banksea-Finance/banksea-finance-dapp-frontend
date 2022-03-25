import { useQuery, UseQueryResult } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { loadMetadata, MetadataResult } from '@/utils/metaplex/metadata'
import { useRefreshController } from '@/contexts'

const useUserDepositedQuery = (staker?: NFTStaker): UseQueryResult<MetadataResult[] | undefined> => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['USER_DEPOSITED_NFTS', staker?.user, staker?.pool, intermediateRefreshFlag],
    async () => {
      if (!staker) return undefined

      const allAssets = await staker.getDepositedNFTs()

      if (!allAssets) return undefined

      const tokenMints = allAssets.map(o => o.account.mint)

      const connection = staker.program.provider.connection

      return (await Promise.all(tokenMints.map(mint => loadMetadata(connection, mint)))).filter(
        o => o !== undefined
      ) as MetadataResult[]
    },
    { refetchInterval: false }
  )
}

export default useUserDepositedQuery
