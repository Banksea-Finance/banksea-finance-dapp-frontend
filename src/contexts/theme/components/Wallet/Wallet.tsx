import React, { useCallback } from 'react'
import styled from 'styled-components'
import { SolanaWallet, SupportWalletNames, useSolanaWeb3 } from '@/contexts/solana-web3'
import { WalletModalContent } from './MyWalletModal'
import { Button } from '../Button'
import { useModal } from '@/contexts'
import { Card, Dialog } from '@/contexts/theme/components'
import { SUPPORT_WALLETS } from '@/contexts/solana-web3/constant'
import { Grid } from '@react-css/grid'
import { shortenAddress } from '@/utils'

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
  const { name, icon } = wallet

  return (
    <WalletItemCard onClick={() => onClick(name)} plain color={'secondary'}>
      <span className="wallet-name">{name}</span>
      <img src={icon} alt="" />
    </WalletItemCard>
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
    <Button onClick={open}>
      <SCCurrentAccount>
        <div className="icon">
          <img src={wallet?.icon} alt="" />
        </div>
        {account && <span>{`${shortenAddress(account.toBase58(), 4)}`}</span>}
      </SCCurrentAccount>
    </Button>
  )
}

export const WalletSelectDialog: React.FC = () => {
  const { select } = useSolanaWeb3()
  const { closeModal } = useModal()

  return (
    <Dialog title={'Connect to a wallet'}>
      <Grid gap={'16px'} rows={'repeat(2, 1fr)'}>
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
      </Grid>
    </Dialog>
  )
}

const ConnectButton = () => {
  const { openModal } = useModal()

  return (
    <Button
      onClick={() => openModal(<WalletSelectDialog />)}
    >
      Connect
    </Button>
  )
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
