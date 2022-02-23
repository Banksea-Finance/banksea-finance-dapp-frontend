import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useSolanaWeb3 } from '@/contexts/solana-web3'
import { WalletModalContent } from './MyWalletModal'
import { Button } from '../Button'
import { useModal } from '@/contexts'

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

const ConnectButton = () => {
  const { select } = useSolanaWeb3()

  return <WalletButton onClick={select}>Connect</WalletButton>
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
