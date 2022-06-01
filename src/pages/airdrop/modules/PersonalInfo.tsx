import React, { useState } from 'react'
import { useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'
import { useRefreshController, useSolanaWeb3 } from '@/contexts'
import { Button, Dialog, Flex, Grid, Skeleton, Tag, Text, useModal } from '@banksea-finance/ui-kit'
import { ReactComponent as DiscordIcon } from '@/assets/images/social-media-logos/discord.svg'
import { Avatar } from '@/pages/airdrop/index.styles'
import { shortenAddress } from '@/utils'
import useDiscordUserQuery from '@/hooks/queries/airdrop/useDiscordUserQuery'
import API from '@/api'
import useDiscordAccessToken from '@/hooks/useDiscordAccessToken'
import { WalletDialog } from '@/components/Wallet/Wallet'

const BindingDialog: React.FC<{ token: string; wallet: string; username: string }> = ({ token, wallet, username }) => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { forceRefresh } = useRefreshController()
  const { closeModal } = useModal()
  const [error, setError] = useState<string>()

  const confirm = () => {
    setLoading(true)

    API.airdrop
      .bindDiscord({ token, wallet })
      .then(() => {
        forceRefresh()
        setLoading(false)
        setDone(true)
        setTimeout(closeModal, 2500)
      })
      .catch(e => {
        setLoading(false)
        setError(`Failed: ${e.toString()}`)
      })
  }

  return (
    <Dialog
      title={'Connect Discord and Wallet'}
      width={'450px'}
      onCancel={closeModal}
      onConfirm={confirm}
      cancelButtonProps={{ children: done ? 'Close' : undefined }}
      confirmButtonProps={{ isLoading: loading, disabled: done }}
      bottomMessage={done
        ? {
          children: 'Connect successfully!',
          color: 'success'
        } : {
          children: error,
          color: 'danger'
        }}
    >
      <Text>
        Are you sure want to connect Discord account <b className={'primary'}>{username}</b> to Solana wallet{' '}
        <b className="primary">{shortenAddress(wallet)}</b>?
      </Text>
    </Dialog>
  )
}

export const PersonalInfo: React.FC = () => {
  const { data: userByWallet, isFetching: userByWalletLoading } = useUserByWalletQuery()
  const { data: discordUser } = useDiscordUserQuery()
  const token = useDiscordAccessToken()
  const { account } = useSolanaWeb3()

  const redirect_uri = `${location.protocol}//${location.host}/airdrop`
  const discordLoginUrl = `https://discord.com/oauth2/authorize?response_type=token&client_id=949189950514032670&scope=identify&redirect_uri=${redirect_uri}`

  const { openModal } = useModal()

  if (!account) {
    return (
      <Flex ai={'center'} jc={'center'} style={{ height: '72px' }}>
        <Text mr={'8px'} fontSize={'18px'} bold>You have NOT connected to a wallet. Please</Text>

        <Button
          variant={'primary'}
          scale={'M'}
          mr={'8px'}
          onClick={() => openModal(<WalletDialog />)}
        >
          Connect to Wallet
        </Button>
      </Flex>
    )
  }

  if (userByWalletLoading) {
    return (
      <Skeleton width={'100%'} height={'72px'} borderRadius={'32px'} />
    )
  }

  if (!userByWallet?.username && !discordUser) {
    return (
      <Flex ai={'center'} jc={'center'} style={{ marginTop: '48px' }}>
        <Text mr={'8px'} fontSize={'18px'} bold>Account info not found by connecting wallet, please </Text>

        <Button variant={'primary'} scale={'M'} onClick={() => window.open(discordLoginUrl, '_blank')}>
          <DiscordIcon style={{ marginRight: '4px' }} />
          Login with Discord
        </Button>
      </Flex>
    )
  }

  if (!userByWallet?.username && discordUser) {
    return (
      <Flex jc="space-between" ai={'center'}>
        <Flex ai={'center'}>
          <Avatar src={discordUser.avatar} />
          <div>
            <Text fontSize={'20px'} bold mb={'8px'}>
              {discordUser.username}
            </Text>
            <Flex ai={'center'}>
              <Text mr={'8px'}>Roles: </Text>
              <Grid gap={'4px'} gridTemplateColumns={`repeat(${discordUser.roles?.length}, max-content)`}>
                {discordUser.roles?.map(role => (
                  <Tag variant={'primaryContrary'} key={role}>
                    <Text fontWeight={500} color={'textContrary'}>{role}</Text>
                  </Tag>
                ))}
              </Grid>
            </Flex>
          </div>
        </Flex>

        <div>
          <Flex ai={'center'}>
            <Text mr={'8px'}>Your Solana address:</Text>
            <Text fontSize={'20px'} bold>
              {shortenAddress(account?.toBase58())}
            </Text>
          </Flex>
          <Button mt={'8px'} scale={'M'} onClick={() => openModal(<BindingDialog token={token!} wallet={account!.toBase58()} username={discordUser.username} />)}>
            Connect Discord and Wallet
          </Button>
        </div>
      </Flex>
    )
  }

  return (
    <Flex jc="space-between" ai={'center'}>
      <Flex ai={'center'}>
        <Avatar src={userByWallet?.avatar} />
        <div>
          <Text fontSize={'20px'} bold mb={'8px'}>
            {userByWallet?.username}
          </Text>
          <Flex ai={'center'}>
            <Text mr={'8px'}>Roles: </Text>
            <Grid gridGap={'8px'} gridTemplateColumns={`repeat(${userByWallet!.roles?.length}, max-content)`}>
              {userByWallet!.roles?.map(role => (
                <Tag variant={'primaryContrary'} key={role}>
                  <Text fontWeight={500} color={'textContrary'}>{role}</Text>
                </Tag>
              ))}
            </Grid>
          </Flex>
        </div>
      </Flex>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, max-content)',
          gap: '4px 20px',
          width: '400px',
          alignItems: 'center'
        }}
      >
        <Text mr={'8px'} fontWeight={500}>Your Solana address:</Text>
        <Text fontSize={'20px'} fontWeight={700}>
          {shortenAddress(account?.toBase58())}
        </Text>
        <Text mr={'8px'} fontWeight={500}>Your airdrop points:</Text>
        <Text fontSize={'20px'} fontWeight={700}>
          -
        </Text>
      </div>
    </Flex>
  )
}
