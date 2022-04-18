import React from 'react'
import styled from 'styled-components'
import { SolanaWallet, SupportWalletNames, useSolanaWeb3 } from '@/contexts/solana-web3'
import { Button } from '../Button'
import { SOLANA_CLUSTER, useModal } from '@/contexts'
import { Card, Dialog, Text, Flex, Grid } from '@/contexts/theme/components'
import { SUPPORT_WALLETS } from '@/contexts/solana-web3/constant'
import { shortenAddress, sleep } from '@/utils'

export const WalletItemCard = styled(Card)`
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;

  img {
    width: 48px;
    height: 48px;
  }
  
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 82vw;
  }
`

export const WalletItem: React.FC<{ wallet: SolanaWallet; onClick: (name: SupportWalletNames) => void }> = ({
  wallet,
  onClick
}) => {
  const { name } = wallet

  return (
    <WalletItemCard onClick={() => onClick(name)} plain color={'secondary'}>
      <span className="wallet-name">{name}</span>
      <img src={wallet.adapter.icon} alt="" />
    </WalletItemCard>
  )
}

export const WalletDialog: React.FC = () => {
  const { select, account, disconnect } = useSolanaWeb3()
  const { closeModal } = useModal()

  const handleDisconnect = async () => {
    closeModal()
    sleep(500)
      .then(disconnect)
  }

  // not connected
  if (!account) {
    return (
      <Dialog title={'Connect to a wallet'}>
        <Grid gridGap={'16px'} gridTemplateRows={`repeat(${Object.keys(SUPPORT_WALLETS).length}, 1fr)`}>
          {
            Object.values(SUPPORT_WALLETS).map(wallet => (
              <WalletItem
                wallet={wallet}
                key={`wallet-item-${wallet.name}`}
                onClick={() => {
                  closeModal()
                  sleep(500).then(() => select(wallet.name as SupportWalletNames))
                }}
              />
            ))
          }
        </Grid>
      </Dialog>
    )
  }

  // connected
  return (
    <Dialog title={'My Wallet'} onCancel={handleDisconnect} cancelButtonProps={{ children: 'Disconnect' }}>
      <Text textAlign={'center'} fontSize={'18px'} mb={'16px'}>
        You are now connected to <b>{shortenAddress(account)}</b>
      </Text>
      <Text textAlign={'center'} fontSize={'18px'}>
        Current Network: {SOLANA_CLUSTER}
      </Text>
    </Dialog>
  )
}

const Wallet: React.FC = () => {
  const { openModal } = useModal()
  const { account, wallet } = useSolanaWeb3()

  return (
    <Button scale={'L'} onClick={() => openModal(<WalletDialog />)}>
      {
        account
          ? (
            <Flex ai={'center'}>
              <img src={wallet?.adapter?.icon} alt="" style={{ marginRight: '4px', width: '32px', height: '32px' }} />
              {account && <span>{`${shortenAddress(account, 4)}`}</span>}
            </Flex>
          ) : (
            'Connect'
          )
      }
    </Button>
  )
}

export default Wallet
