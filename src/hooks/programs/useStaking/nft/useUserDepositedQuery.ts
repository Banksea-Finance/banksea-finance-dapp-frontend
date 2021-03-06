import { useQuery, UseQueryResult } from 'react-query'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import { loadMetadata, MetadataResult } from '@/utils/metaplex/metadata'
import { useRefreshController } from '@/contexts'

const useUserDepositedQuery = (staker?: NFTStaker): UseQueryResult<MetadataResult[]> => {
  const { intermediateRefreshFlag } = useRefreshController()

  return useQuery(
    ['NFT_UserDeposited', staker?.user, staker?.pool, intermediateRefreshFlag],
    async () => {
      if (!staker) return []

      const allAssets = await staker.getDepositedNFTs()
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
