import { useQuery, UseQueryResult } from 'react-query'
import API from '@/api'
import { GrantKeys } from '@/pages/airdrop/constant'

export type GrantVotes = {
  buildId: number
  name: GrantKeys
  img: string
  totalVotes: string
  voteTime: number
}

const useGrantVotesQuery = (address: string, buildName: string): UseQueryResult<GrantVotes | null> => {
  return useQuery(
    ['GrantVotes', address, buildName],
    () => {
      return API.airdrop.getUserVoteInfo({ address, buildName })
    },
    { refetchInterval: false }
  )
}

export default useGrantVotesQuery
