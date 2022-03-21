import React, { useState } from 'react'
import { useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'
import { useModal, useSolanaWeb3 } from '@/contexts'
import { Button, Card, Dialog, Tag, Text } from '@/contexts/theme/components'
import { ReactComponent as DiscordIcon } from '@/assets/images/social-media-logos/discord.svg'
import { Flex } from '@react-css/flex'
import { Avatar } from '@/pages/airdrop/index.styles'
import { shortenAddress } from '@/utils'
import useDiscordUserQuery from '@/hooks/queries/airdrop/useDiscordUserQuery'
import { Grid } from '@react-css/grid'
import API from '@/api'
import useDiscordAccessToken from '@/hooks/useDiscordAccessToken'

const BindingDialog: React.FC<{ token: string; wallet: string; username: string }> = ({ token, wallet, username }) => {
  const [loading, setLoading] = useState(false)

  const { openModal, closeModal } = useModal()
  const [error, setError] = useState<string>()

  const confirm = () => {
    setLoading(true)

    API.airdrop
      .bindDiscord({ token, wallet })
      .then(() => {
        openModal(
          <Dialog title={'Connect Discord and Wallet'} width={'450px'} showCancelButton={false} onConfirm={closeModal}>
            <Text>Connect successfully!</Text>
          </Dialog>
        )
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
      confirmButtonProps={{ isLoading: loading }}
      bottomMessage={{
        children: error,
        color: 'failure'
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
  const { data: userByWallet } = useUserByWalletQuery()
  const { data: discordUser } = useDiscordUserQuery()
  const token = useDiscordAccessToken()
  const { account } = useSolanaWeb3()

  const redirect_uri = `${location.protocol}//${location.host}/airdrop`
  const discordLoginUrl = `https://discord.com/oauth2/authorize?response_type=token&client_id=949189950514032670&scope=identify&redirect_uri=${redirect_uri}`

  const { openModal } = useModal()

  if (!userByWallet?.username && !discordUser) {
    return (
      <Card width={'100%'} p={'24px 8%'}>
        <Flex alignItemsCenter justifyCenter>
          <Text mr={'8px'} fontSize={'18px'}>Account info not found by connecting wallet, please </Text>

          <Button variant={'subtle'} onClick={() => window.open(discordLoginUrl, '_blank')}>
            <DiscordIcon style={{ marginRight: '4px' }} />
            Login with Discord
          </Button>
        </Flex>
      </Card>
    )
  }

  if (!userByWallet?.username && discordUser) {
    return (
      <Card width={'100%'} p={'24px 8%'}>
        <Flex justifySpaceBetween alignItemsCenter>
          <Flex alignItemsCenter>
            <Avatar src={discordUser.avatar} />
            <div>
              <Text fontSize={'20px'} bold mb={'8px'}>
                {discordUser.username}
              </Text>
              <Flex alignItemsCenter>
                <Text mr={'8px'}>Roles: </Text>
                <Grid gap={'4px'} columns={`repeat(${discordUser.roles?.length}, max-content)`}>
                  {discordUser.roles?.map(role => (
                    <Tag variant={'secondary'} key={role}>
                      {role}
                    </Tag>
                  ))}
                </Grid>
              </Flex>
            </div>
          </Flex>

          <div>
            <Flex alignItemsCenter>
              <Text mr={'8px'}>Your Solana address:</Text>
              <Text fontSize={'20px'} bold>
                {shortenAddress(account?.toBase58())}
              </Text>
            </Flex>
            <Button mt={'8px'} scale={'sm'} onClick={() => openModal(<BindingDialog token={token!} wallet={account!.toBase58()} username={discordUser.username} />)}>
              Connect Discord and Wallet
            </Button>
          </div>
        </Flex>
      </Card>
    )
  }

  return (
    <Card width={'100%'} p={'24px 8%'}>
      <Flex justifySpaceBetween alignItemsCenter>
        <Flex alignItemsCenter>
          <Avatar src={userByWallet?.avatar} />
          <div>
            <Text fontSize={'20px'} bold mb={'8px'}>
              {userByWallet?.username}
            </Text>
            <Flex alignItemsCenter>
              <Text mr={'8px'}>Roles: </Text>
              <Grid gap={'4px'} columns={`repeat(${userByWallet!.roles?.length}, max-content)`}>
                {userByWallet!.roles?.map(role => (
                  <Tag variant={'secondary'} key={role}>
                    {role}
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
          <Text mr={'8px'}>Your Solana address:</Text>
          <Text fontSize={'20px'} bold>
            {shortenAddress(account?.toBase58())}
          </Text>
          <Text mr={'8px'}>Your airdrop points:</Text>
          <Text fontSize={'20px'} bold>
            -
          </Text>
        </div>
      </Flex>
    </Card>
  )
}
