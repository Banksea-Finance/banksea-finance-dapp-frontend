import React, { useCallback, useMemo, useState } from 'react'
import { AllGrantsDialog } from '@/pages/airdrop/components/AllGrantsDialog'
import { Button, Card, Dialog, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { useModal, useSolanaWeb3 } from '@/contexts'
import { ChainConfig, CHAINS, useMultiChainsWeb3, WalletConfig, WALLETS } from '@/hooks/useMultiChainsWeb3'
import { Grid } from '@react-css/grid'
import { shortenAddress } from '@/utils'
import { TextProps } from '@/contexts/theme/components/Text'
import useGrantVotesQuery from '@/hooks/queries/airdrop/useGrantVotesQuery'
import { RegisterGrantConfig } from '@/pages/airdrop/constant'
import BigNumber from 'bignumber.js'
import { ClipLoader } from 'react-spinners'
import API from '@/api'
import styled from 'styled-components'

const GrantImage = styled.img`
  width: 550px;
  border-radius: 20px;
  margin-bottom: 8px;
  border-bottom: 1.5px solid #ccc;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 80vw;
  }
`

const Wallets: React.FC /*<{ chainId: SupportedChainIds }>*/ = (/*{ chainId }*/) => {
  const { activate } = useMultiChainsWeb3()

  const handleConnect = (wallet: WalletConfig) => activate(wallet /*, chainId*/)

  return (
    <Grid gap={'20px'}>
      {Object.values(WALLETS).map(w => (
        <Card onClick={() => handleConnect(w)} key={w.name} p={'4px 32px'} style={{ cursor: 'pointer' }} activeOnHover>
          <Flex alignItemsCenter>
            <img src={w.icon} style={{ width: '64px', height: '64px', borderRadius: '50%' }} alt="" />
            <Text ml={'16px'} fontSize={'22px'} fontWeight={500} important>
              {w.name}
            </Text>
          </Flex>
        </Card>
      ))}
    </Grid>
  )
}

const ConfirmRegister: React.FC<RegisterGrantConfig /* & { requiredChainId: number }*/> = ({
  /*requiredChainId,*/ grantKey
}) => {
  const { account, connectedWallet, disconnect, provider } = useMultiChainsWeb3()
  const { account: solanaAccount } = useSolanaWeb3()

  const wallet = WALLETS[connectedWallet!]
  // const chain = chainId ? CHAINS[chainId] : undefined

  const { data: grantVotes, isLoading } = useGrantVotesQuery(account!, grantKey)

  const [requesting, setRequesting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  /*useEffect(() => {
    if (chainId && requiredChainId !== chainId) {
      void disconnect()
    }
  }, [requiredChainId, disconnect, chainId])*/

  const Row: React.FC = ({ children }) => (
    <Flex alignItemsCenter style={{ marginBottom: '8px' }}>
      {children}
    </Flex>
  )

  const ScopeText: React.FC<TextProps> = ({ children, ...rest }) => (
    <Text {...rest} fontSize={'24px'}>
      {children}
    </Text>
  )

  const Label: React.FC<TextProps> = ({ children, ...rest }) => (
    <ScopeText {...rest} style={{ width: '180px' }}>
      {children}
    </ScopeText>
  )

  const messageToSign = useMemo(() => {
    if (!account) return undefined

    return account
    //     return `Hi, dear friend! We need to sign
    // the message to confirm that the
    // address(${account})
    // is own to you.
    // This will cost no any fees.
    // `
  }, [account])

  const handleConfirm = useCallback(async () => {
    if (!provider || !messageToSign) return

    setError('')
    setRequesting(true)

    const signed = await provider?.getSigner().signMessage(messageToSign)

    API.airdrop.registerVote({
      address: account!,
      buildName: grantKey,
      message: messageToSign,
      signature: signed,
      wallet: solanaAccount!.toBase58()
    })
      .then(() => {
        setSuccess(true)
      })
      .catch(e => {
        setError(e.toString())
      })
      .finally(() => {
        setRequesting(false)
      })
  }, [provider, messageToSign])

  return (
    <>
      <Row>
        <Label mr={'16px'}>Account: </Label>
        <ScopeText>{shortenAddress(account, 6)}</ScopeText>
      </Row>

      <Row>
        <Label mr={'16px'}>Wallet: </Label>
        <Flex alignItemsCenter>
          <img src={wallet.icon} alt="" style={{ width: '32px', marginRight: '8px' }} />
          {wallet.name}
        </Flex>
      </Row>

      {/*<Row>
        <Label mr={'16px'}>Chain: </Label>
        <Flex alignItemsCenter>
          <img src={chain?.chainLogo} alt="" style={{ width: '32px', marginRight: '8px' }} />
          {chain?.chainName}
        </Flex>
      </Row>*/}

      <Row>
        <Label mr={'16px'}>Voted amount: </Label>
        <ScopeText>
          {isLoading ? (
            <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          ) : grantVotes?.totalVotes ? (
            new BigNumber(grantVotes.totalVotes).toString()
          ) : (
            'Not Found'
          )}
        </ScopeText>
      </Row>

      <Grid gap={'20px'} columns={'repeat(2, 1fr)'}>
        <Button variant={'danger'} mt={'24px'} onClick={disconnect}>
          Disconnect
        </Button>
        <Button variant={'primary'} mt={'24px'} onClick={handleConfirm} isLoading={requesting} disabled={success}>
          {
            success ? 'Registered Successfully' : 'Confirm to Register'
          }
        </Button>
      </Grid>

      {
        error && (
          <Text color={'failure'} textAlign={'center'} marginTop={'8px'} fontSize={'18px'} important bold>
            Error: {error}
          </Text>
        )
      }
    </>
  )
}

const SelectWallets: React.FC<{ grantName: string; chain: ChainConfig }> = ({ chain, grantName }) => {
  return (
    <>
      <Text fontSize={'20px'} mr={'4px'} mb={'8px'}>
        You are now trying to register <b className="primary">{grantName}</b> <br />
      </Text>

      <Flex alignItemsCenter>
        <Text fontSize={'20px'}>The grant was held on</Text>
        <img src={chain.chainLogo} alt="" style={{ width: '24px', height: '24px', margin: '0 6px 0 8px' }} />
        <Text fontSize={'20px'} mr={'4px'} bold color={'primary'}>
          {chain.chainName}
        </Text>
      </Flex>

      <Text fontSize={'20px'} mr={'4px'} mt={'4px'} mb={'24px'}>
        So firstly, you need to connect to it by the wallets below:
      </Text>

      <Wallets />
    </>
  )
}

const LoginViaGithub: React.FC = () => {
  const searchParams =  new URLSearchParams({
    client_id: 'de2f3c6aaec4c5ccbc0c',
    redirect_uri: '',
    login: '',
    scope: '',
    state: Date.now().toString(),
    allow_signup: 'true'
  })

  const url = `https://github.com/login/oauth/authorize?${searchParams.toString()}`

  return (
    <>
      <Button as={'a'} href={url} target={'_blank'} rel={'noreferrer'}>Login via Github</Button>
    </>
  )
}

export const RegisterGrantDialog: React.FC<RegisterGrantConfig> = props => {
  const { name, chainId, image, grantKey } = props
  const { openModal } = useModal()
  const { account } = useMultiChainsWeb3()

  if (grantKey === 'Gitcoin') {
    return (
      <Dialog
        title={'Register Grant'}
        titlePrefix={
          <Button
            scale={'M'}
            mr={'8px'}
            variant={'danger'}
            onClick={() => openModal(<AllGrantsDialog />)}
          >
            Go back
          </Button>
        }
      >
        <GrantImage src={image} alt="" />

        {account ? <ConfirmRegister {...props} /> : <LoginViaGithub />}
      </Dialog>
    )
  }

  const chain = CHAINS[chainId!]

  return (
    <Dialog
      variant={'success'}
      title={'Register Grant'}
      titlePrefix={
        <Button
          scale={'M'}
          mr={'8px'}
          variant={'danger'}
          onClick={() => openModal(<AllGrantsDialog />)}
        >
          Go back
        </Button>
      }
    >
      <GrantImage src={image} alt="" />

      {account ? <ConfirmRegister {...props} /> : <SelectWallets chain={chain} grantName={name} />}
    </Dialog>
  )
}
