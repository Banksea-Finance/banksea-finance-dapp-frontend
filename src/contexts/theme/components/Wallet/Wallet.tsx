import React, { useCallback } from 'react'
import styled from 'styled-components'
import { SolanaWallet, SupportWalletNames, useSolanaWeb3 } from '@/contexts/solana-web3'
import { WalletModalContent } from './MyWalletModal'
import { Button } from '../Button'
import { useModal } from '@/contexts'
import { useResponsive } from '@/contexts/theme'
import { Card, Text } from '@/contexts/theme/components'
import { SUPPORT_WALLETS } from '@/contexts/solana-web3/constant'

const WalletButton = styled(Button)`
  font-weight: bold;
`

const SCCurrentAccount = styled.div`
  display: flex;
  align-items: center;

  .icon {
    margin-right: 1.2rem;

    img {
      width: 26px;
      height: 26px;
    }
  }
`

export const WalletItemContainer = styled(Card)`
  background: ${({ theme }) => theme.colors.primaryContrary};
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
    width: 64px;
    height: 64px;
  }
`

export const WalletItem: React.FC<{ wallet: SolanaWallet; onClick: (name: SupportWalletNames) => void }> = ({
  wallet,
  onClick
}) => {
  const { name, icon } = wallet

  return (
    <WalletItemContainer onClick={() => onClick(name)} plain>
      <span className="wallet-name">{name}</span>
      <img className="SelectImg" src={icon} alt="" />
    </WalletItemContainer>
  )
}

const CurrentAccount: React.FC = () => {
  const { wallet, account, disconnect } = useSolanaWeb3()

  const { openModal } = useModal()

  const open = useCallback(() => {
    if (!account) {
      return
    }

    openModal(<WalletModalContent account={account.toString()} disconnect={disconnect} />)
  }, [account, disconnect, openModal])

  return (
    <WalletButton onClick={open}>
      <SCCurrentAccount>
        <div className="icon">
          <img src={wallet?.icon} alt="" />
        </div>
        {account && <span>{`${account.toBase58().substring(0, 5)}...${account.toBase58().substring(-4, 4)}`}</span>}
      </SCCurrentAccount>
    </WalletButton>
  )
}

const WalletSelectDialog: React.FC = () => {
  const { isDesktop } = useResponsive()
  const { select } = useSolanaWeb3()
  const { closeModal } = useModal()

  const style: React.CSSProperties = isDesktop
    ? {
      width: '400px',
      height: 'fit-content',
      display: 'grid',
      rowGap: '16px',
      alignItems: 'center',
      padding: '24px 32px'
    }
    : {
      width: '90%',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }

  return (
    <Card style={style}>
      <Text fontSize={'28px'} marginBottom={'16px'} important textAlign={'center'}>
        Connect Wallet
      </Text>

      {Object.values(SUPPORT_WALLETS).map(wallet => (
        <WalletItem
          wallet={wallet}
          key={wallet.name}
          onClick={() => {
            select(wallet.name as SupportWalletNames)
            closeModal()
          }}
        />
      ))}
    </Card>
  )
}

const ConnectButton = () => {
  const { openModal } = useModal()

  return <WalletButton onClick={() => openModal(<WalletSelectDialog />)}>Connect</WalletButton>
}

const Wallet: React.FC = () => {
  const { account } = useSolanaWeb3()

  return (
    <>
      {!account && <ConnectButton />}
      {!!account && <CurrentAccount />}
    </>
  )
}

export default Wallet
