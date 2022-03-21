import { useQuery, UseQueryResult } from 'react-query'
import API from '@/api'
import useDiscordAccessToken from '@/hooks/useDiscordAccessToken'
import { UserInfo } from '@/hooks/queries/airdrop/useUserByWalletQuery'

const useDiscordUserQuery = (): UseQueryResult<Required<UserInfo> | undefined> => {
  const token = useDiscordAccessToken()

  return useQuery(
    ['DiscordUser', token],
    () => {
      return token ? API.airdrop.getDiscordUser(token) : undefined
    }
  )
}

export default useDiscordUserQuery
