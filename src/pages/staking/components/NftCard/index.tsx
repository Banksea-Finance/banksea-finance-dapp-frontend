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
  background-image: url("${require('@/assets/images/citizen-one-bg.png')}");
  padding: 16px;
  border-radius: 32px;
  width: 258px;
`

const NFTImage = styled.img`
  border-radius: 16px;
  width: 100%;
  height: 232px;
  object-fit: cover;
  margin-bottom: 8px;
`

export type NFTCardProps = NFTStakingPoolConfig & MetadataResult & {
  type: NFTStatus
}

const NftCard: React.FC<NFTCardProps> = props => {
  const { data, type, ...rest } = props

  const { deposit, withdraw } = useNFTStaking(rest)

  return (
    <StyledNftCard>
      <NFTImage src={data?.image} alt="" />
      <Text bold fontSize={'24px'} color={'primary'} mb={'8px'}>{data?.name}</Text>
      {
        type === 'deposited'
          ? (
            <Button scale={'sm'} onClick={() => withdraw(props)}>Withdraw</Button>
          ) : (
            <Button scale={'sm'} onClick={() => deposit(props)}>Deposit</Button>
          )
      }
    </StyledNftCard>
  )
}

export default NftCard
