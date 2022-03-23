import { useQuery, UseQueryResult } from 'react-query'
import API from '@/api'
import { GrantKeys } from '@/pages/airdrop/constant'
import { useRefreshController } from '@/contexts'

export type GrantVotes = {
  buildId: number
  name: GrantKeys
  img: string
  totalVotes: string
  voteTime: number
}

const useGrantVotesQuery = (address: string, buildName: string): UseQueryResult<GrantVotes | null> => {
  const { quietRefreshFlag } = useRefreshController()

  return useQuery(
    ['GrantVotes', address, buildName, quietRefreshFlag],
    () => {
      return API.airdrop.getUserVoteInfo({ address, buildName })
    },
    { refetchInterval: false }
  )
}

export default useGrantVotesQuery
