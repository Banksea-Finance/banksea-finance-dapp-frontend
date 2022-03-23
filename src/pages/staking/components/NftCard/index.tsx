import React from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { NFTStatus } from '@/pages/staking/components/NftStakingPoolCard'

const StyledNftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(247, 247, 247);
  background-size: 100%;
  border-radius: 20px;
`

const NFTImage = styled.img`
  width: 100%;
  height: 232px;
  object-fit: cover;
`

export type OperableNftCardProps = NFTStakingPoolConfig & MetadataResult & {
  type: NFTStatus
}

const StyledButton = styled(Button)`
  background: rgba(25, 214, 151, 0.82);
  border-radius: 16px;
`

const OperableNftCard: React.FC<OperableNftCardProps> = props => {
  const { data, account, type, ...rest } = props

  const { deposit, withdraw } = useNFTStaking(rest)

  return (
    <StyledNftCard isSuccess width={'258px'}>
      <NFTImage src={data?.image} alt="" />
      <Text fontWeight={700} fontSize={'20px'} color={'primary'} m={'12px 0'}>{account?.data.data.name}</Text>
      <div style={{ position: 'absolute', right: '8px', top: '8px' }}>
        {
          type === 'deposited'
            ? (
              <StyledButton scale={'xs'} variant={'primaryContrary'} onClick={() => withdraw(props)}>Withdraw</StyledButton>
            ) : (
              <StyledButton scale={'xs'} variant={'primaryContrary'} onClick={() => deposit(props)}>Deposit</StyledButton>
            )
        }
      </div>

    </StyledNftCard>
  )
}

const InoperableNftCard: React.FC<MetadataResult> = props => {
  const { data, account } = props

  return (
    <StyledNftCard isSuccess width={'208px'}>
      <NFTImage src={data?.image} alt="" />
      <Text fontWeight={700} fontSize={'16px'} color={'primary'} m={'8px 0'}>{account?.data.data.name}</Text>
    </StyledNftCard>
  )
}

export { OperableNftCard, InoperableNftCard }
