import styled from 'styled-components'
import React from 'react'
import { SolanaWallet, SupportWalletNames } from './'
import { Card } from '@/contexts/theme/components'

export const WalletItemContainer = styled(Card)`
  background: ${({ theme }) => theme.colors.primaryContrary};
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  border-radius: 20px;
  padding: 1rem 2.2rem;
  color: white;
  font-size: 1.8rem;
  font-weight: 500;
  cursor: pointer;

  img {
    width: 5rem;
    height: 5rem;
  }
`

export const WalletItem: React.FC<{ wallet: SolanaWallet; onClick: (name: SupportWalletNames) => void }> = ({
  wallet,
  onClick
}) => {
  const { name, icon } = wallet

  return (
    <WalletItemContainer onClick={() => onClick(name)}>
      <span className="wallet-name">{name}</span>
      <img className="SelectImg" src={icon} alt="" />
    </WalletItemContainer>
  )
}
