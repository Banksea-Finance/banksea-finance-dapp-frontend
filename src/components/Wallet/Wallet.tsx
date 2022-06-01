import React from 'react'
import styled from 'styled-components'
import { SupportWalletNames, useSolanaWeb3 } from '@/contexts/solana-web3'
import { SOLANA_CLUSTER } from '@/contexts'
import { SUPPORT_WALLETS } from '@/contexts/solana-web3/constant'
import { shortenAddress, sleep } from '@/utils'
import { Button, Card, Dialog, Flex, Grid, Text, useModal } from '@banksea-finance/ui-kit'

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

  ${({ theme }) => theme.mediaQueries.maxXl} {
    width: 82vw;
  }
`

const StyledWalletButton = styled(Button)`
  background: linear-gradient(${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryContrary});
`

export const WalletItem: React.FC<{ name: string; icon: string; onClick: () => void }> = ({ name, icon, onClick }) => {
  return (
    <WalletItemCard onClick={onClick} plain color={'secondary'}>
      <span className="wallet-name">{name}</span>
      <img src={icon} alt="" />
    </WalletItemCard>
  )
}

export const WalletDialog: React.FC = () => {
  const { closeModal } = useModal()
  const { account, select, disconnect } = useSolanaWeb3()

  const handleDisconnect = async () => {
    closeModal()
    sleep(500).then(disconnect)
  }

  // not connected
  if (!account) {
    return (
      <Dialog title={'Connect to a wallet'}>
        <Grid gridGap={'16px'} gridTemplateRows={`repeat(${Object.keys(SUPPORT_WALLETS).length}, 1fr)`}>
          {
            Object.values(SUPPORT_WALLETS).map(wallet => (
              <WalletItem
                name={wallet.name}
                icon={wallet.adapter.icon}
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
    <StyledWalletButton autoScale onClick={() => openModal(<WalletDialog />)}>
      {
        account ? (
          <Flex ai={'center'}>
            <img src={wallet?.adapter?.icon} alt="" style={{ marginRight: '16px', width: '30px', height: '30px' }} />
            {account && <Text>{`${shortenAddress(account, 4)}`}</Text>}
          </Flex>
        ) : (
          'Connect'
        )
      }
    </StyledWalletButton>
  )
}

export default Wallet
