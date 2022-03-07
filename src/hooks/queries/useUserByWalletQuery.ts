import { useQuery, UseQueryResult } from 'react-query'
import { useSolanaWeb3 } from '@/contexts'

export interface User {
  wallet: string
  discord: Discord
  grants: Grant[]
}

export interface Discord {
  userId: string
  username: string
  avatar: string
  roles: string[]
}

export interface Grant {
  key: string
  name: string
  img: string
  totalVotes: string
  voteTime: number
  voterAddress: string
}


export const useUserByWalletQuery = (): UseQueryResult<User> => {
  const { account } = useSolanaWeb3()

  return useQuery(
    ['UserByWallet', account],
    async (): Promise<User | undefined> => {
      if (!account) return undefined

      return {
        wallet: '8tqMgHc8WLtHyc5eRjMTZfqHuGfTCa2G2zHjsMQxBwrB',
        discord: {
          userId: '856442216318500895',
          username: 'Disperito',
          avatar: 'https://cdn.discordapp.com/avatars/856442216318500895/c3287f8bfbbff6a6195659e89ec2041a.webp',
          roles: [
            'OG', 'Hero'
          ]
        },
        grants: [
          {
            key: 'solana-1',
            name: 'Solana Grant',
            img: 'https://hackerlink.s3.amazonaws.com/static/files/Solana1_GKLekgH.jpg',
            totalVotes: '12',
            voteTime: 1635683758,
            voterAddress: '0x1B4958415cbFF0C02a8a47a52F3410e25D1e1d25'
          },
          {
            key: 'solana-2',
            name: 'Solana Ignition Hackathon Round-2',
            img: 'https://hackerlink.s3.amazonaws.com/static/files/Solana2_eJt96fb.jpg',
            totalVotes: '24',
            voteTime: 1635683758,
            voterAddress: '0x185fD04Da9Eb4c46b8237745849dA2fAf524187F'
          }
        ]
      }
    }
  )
}
