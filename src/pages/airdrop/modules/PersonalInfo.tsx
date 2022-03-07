import React from 'react'
import { useUserByWalletQuery } from '@/hooks/queries/useUserByWalletQuery'
import { useSolanaWeb3 } from '@/contexts'
import { Button, Card, Text } from '@/contexts/theme/components'
import { ReactComponent as DiscordIcon } from '@/assets/images/social-media-logos/discord.svg'
import { Flex } from '@react-css/flex'
import { Avatar } from '@/pages/airdrop/index.styles'
import { shortenAddress } from '@/utils'

export const PersonalInfo: React.FC = () => {
  // const { data: user } = useDiscordOAuth2UserByTokenQuery()
  const { data: userByWallet } = useUserByWalletQuery()
  const { account } = useSolanaWeb3()

  const redirect_uri = `${location.protocol}//${location.host}/airdrop`
  const discordLoginUrl = `https://discord.com/oauth2/authorize?response_type=token&client_id=949189950514032670&scope=identify&redirect_uri=${redirect_uri}`

  if (!userByWallet?.discord) {
    return (
      <Button variant={'subtle'} onClick={() => window.open(discordLoginUrl, '_blank')}>
        <DiscordIcon style={{ marginRight: '4px' }} />
        Login with Discord
      </Button>
    )
  }

  return (
    <Card width={'100%'} p={'24px 8%'}>
      <Flex justifySpaceBetween alignItemsCenter>
        <Flex alignItemsCenter>
          <Avatar src={userByWallet?.discord.avatar} />
          <div>
            <Text fontSize={'20px'} bold mb={'8px'}>{userByWallet?.discord.username}</Text>
            <Text>Roles: {userByWallet?.discord.roles.join(', ')}</Text>
          </div>
        </Flex>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '4px 20px', width: '400px', alignItems: 'center' }}>
          <Text mr={'8px'}>
            Your Solana address:
          </Text>
          <Text fontSize={'20px'} bold>
            {shortenAddress(account?.toBase58())}
          </Text>
          <Text mr={'8px'}>
            Your airdrop points:
          </Text>
          <Text fontSize={'20px'} bold>233,333,44</Text>
        </div>
      </Flex>
    </Card>
  )
}
