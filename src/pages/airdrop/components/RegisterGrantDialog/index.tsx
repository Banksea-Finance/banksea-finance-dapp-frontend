import React, { useCallback, useEffect, useMemo } from 'react'
import { AllGrantsDialog, Grant } from '@/pages/airdrop/components/AllGrantsDialog'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { useModal } from '@/contexts'
import { CHAINS, SupportedChainIds, useMultiChainsWeb3, WalletConfig, WALLETS } from '@/hooks/useMultiChainsWeb3'
import { Grid } from '@react-css/grid'
import { shortenAddress } from '@/utils'
import { TextProps } from '@/contexts/theme/components/Text'

const WalletItem: React.FC<WalletConfig & { onClick: () => void }> = ({ icon, onClick, name }) => {
  return (
    <Card p={'4px 32px'} style={{ cursor: 'pointer' }} activeOnHover onClick={onClick}>
      <Flex alignItemsCenter>
        <img src={icon} style={{ width: '64px', height: '64px', borderRadius: '50%' }} alt="" />
        <Text ml={'16px'} fontSize={'22px'} bold>
          {name}
        </Text>
      </Flex>
    </Card>
  )
}

const Wallets: React.FC<{ chainId: SupportedChainIds }> = ({ chainId }) => {
  const { activate } = useMultiChainsWeb3()

  const handleConnect = (wallet: WalletConfig) => activate(wallet, chainId)

  return (
    <Grid gap={'20px'}>
      {Object.values(WALLETS).map(w => (
        <WalletItem onClick={() => handleConnect(w)} {...w} key={w.name} />
      ))}
    </Grid>
  )
}

const ConfirmRegister: React.FC<{ requiredChainId: number }> = ({ requiredChainId }) => {
  const { account, connectedWallet, disconnect, chainId, provider } = useMultiChainsWeb3()

  const wallet = WALLETS[connectedWallet!]
  const chain = chainId ? CHAINS[chainId] : undefined

  useEffect(() => {
    if (chainId && requiredChainId !== chainId) {
      void disconnect()
    }
  }, [requiredChainId, disconnect, chainId])

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

    return `Hi, dear friend! We need to sign 
the message to confirm that the 
address(${account}) 
is own to you.
This will cost no any fees. 
`
  }, [account])

  const handleConfirm = useCallback(async () => {
    if (!provider || !messageToSign) return

    const signed = await provider?.getSigner().signMessage(messageToSign)

    console.log(signed)
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

      <Row>
        <Label mr={'16px'}>Chain: </Label>
        <Flex alignItemsCenter>
          <img src={chain?.chainLogo} alt="" style={{ width: '32px', marginRight: '8px' }} />
          {chain?.chainName}
        </Flex>
      </Row>

      <Row>
        <Label mr={'16px'}>Voted amount: </Label>
        <ScopeText>124</ScopeText>
      </Row>

      <Grid gap={'20px'} columns={'repeat(2, 1fr)'}>
        <Button variant={'danger'} mt={'24px'} onClick={disconnect}>
          Disconnect and go back
        </Button>
        <Button variant={'primary'} mt={'24px'} onClick={handleConfirm}>
          Confirm to register
        </Button>
      </Grid>
    </>
  )
}

export const RegisterGrantDialog: React.FC<Grant> = ({ name, chainId, image }) => {
  const { openModal } = useModal()

  const chain = CHAINS[chainId]

  const { account } = useMultiChainsWeb3()

  const SelectWallets: React.FC = () => {
    return (
      <>
        <Text fontSize={'20px'} mr={'4px'} mb={'8px'}>
          You are now trying to register <span className="primary">{name}</span> <br />
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

        <Wallets chainId={chainId} />
      </>
    )
  }

  return (
    <Card p={'32px'} isActive>
      <Button
        scale={'sm'}
        variant={'danger'}
        onClick={() => openModal(<AllGrantsDialog />)}
        style={{ position: 'absolute' }}
      >
        Go back
      </Button>

      <Flex justifyCenter>
        <Text important bold fontSize={'32px'} mb={'16px'}>
          Register Grant
        </Text>
      </Flex>

      <Flex justifyCenter style={{ marginBottom: '24px' }}>
        <img src={image} alt="" style={{ width: '550px', borderRadius: '20px' }} />
      </Flex>

      {account ? <ConfirmRegister requiredChainId={chainId} /> : <SelectWallets />}
    </Card>
  )
}
