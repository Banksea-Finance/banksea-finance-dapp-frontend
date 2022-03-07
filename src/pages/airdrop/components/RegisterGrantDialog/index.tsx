import React from 'react'
import { AllGrantsDialog, Grant } from '@/pages/airdrop/components/AllGrantsDialog'
import { Button, Card, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { useModal } from '@/contexts'
import {
  SUPPORTED_CHAIN_KEYS,
  SUPPORTED_CHAINS,
  SUPPORTED_WALLET_KEYS,
  SUPPORTED_WALLETS,
  SupportedChainKeys,
  SupportedWallet
} from '@/hooks/useMultiChains'
import { Grid } from '@react-css/grid'

const WalletItem: React.FC<SupportedWallet> = ({ icon, walletKey }) => {
  const name = SUPPORTED_WALLET_KEYS[walletKey]

  return (
    <Card p={'4px 32px'}>
      <Flex alignItemsCenter>
        <img src={icon} style={{ width: '64px', height: '64px', borderRadius: '50%' }} alt="" />
        <Text ml={'16px'} fontSize={'22px'} bold>
          {name}
        </Text>
      </Flex>
    </Card>
  )
}


const SupportedWallets: React.FC<{ chainKey: SupportedChainKeys }> = ({ chainKey }) => {
  const chain = SUPPORTED_CHAINS.find(chain => chain.chainKey === chainKey)!

  const walletKeys = chain.supportWallets

  const wallets = SUPPORTED_WALLETS.filter(wallet => walletKeys.some(key => wallet.walletKey.includes(key)))

  return (
    <Grid gap={'20px'}>
      {
        wallets.map(w => (
          <WalletItem {...w} key={w.walletKey} />
        ))
      }
    </Grid>
  )
}

export const RegisterGrantDialog: React.FC<Grant> = ({ name, chain: chainKey, image }) => {
  const { openModal } = useModal()

  const chain = SUPPORTED_CHAINS.find(chain => chain.chainKey === chainKey)!
  const chainName = SUPPORTED_CHAIN_KEYS[chain.chainKey]

  return (
    <Card p={'32px'} isActive>
      <Button scale={'sm'} variant={'danger'} onClick={() => openModal(<AllGrantsDialog />)} style={{ position: 'absolute' }}>
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

      <Text fontSize={'20px'} mr={'4px'} mb={'8px'}>
        You are now trying to register <span className="primary">{name}</span> <br />
      </Text>


      <Flex alignItemsCenter>
        <Text fontSize={'20px'}>The grant was held on</Text>
        <img src={chain.chainLogo} alt="" style={{ width: '24px', height: '24px', margin: '0 6px 0 8px' }} />
        <Text fontSize={'20px'} mr={'4px'} bold color={'primary'}>{chainName}</Text>
      </Flex>

      <Text fontSize={'20px'} mr={'4px'} mt={'4px'} mb={'24px'}>
        So you need to connect to it by the wallets below:
      </Text>

      <SupportedWallets chainKey={chain!.chainKey} />
    </Card>
  )
}
