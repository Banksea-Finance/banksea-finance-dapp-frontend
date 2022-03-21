import { useQuery, UseQueryResult } from 'react-query'
import { useSolanaWeb3 } from '@/contexts'
import API from '@/api'
import { GrantKeys } from '@/pages/airdrop/constant'

export interface User {
  wallet: string
  discord: Discord
  grants: UserVotedGrant[]
}

export interface UserInfo {
  userId?: string
  username?: string
  roles?: any[]
  wallet: string
  avatar?: string
  builds: UserVotedGrant[]
}

export interface Discord {
  userId: string
  username: string
  avatar: string
  roles: string[]
}

export interface UserVotedGrant {
  grant: GrantKeys
  vote: string
  voteTime: number
  address: string
}

export const useUserByWalletQuery = (): UseQueryResult<UserInfo> => {
  const { account } = useSolanaWeb3()

  return useQuery(
    ['USER_BY_WALLET', account],
    async () => {
      if (!account) return undefined

      return API.airdrop.getUserInfo(account.toBase58())
    }
  )
}
