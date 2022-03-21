import { useQuery } from 'react-query'
import API from '@/api'

const useGrantVotesQuery = (address: string, buildName: string) => {
  return useQuery(
    ['GrantVotes', address, buildName],
    () => {
      return API.airdrop.findGrantVoteInfo(address, buildName)
    },
    { refetchInterval: false }
  )
}

export default useGrantVotesQuery
