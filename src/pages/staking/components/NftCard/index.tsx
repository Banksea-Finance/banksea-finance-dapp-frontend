import React, { useState } from 'react'
import { Button, Card, Skeleton, Text } from '@/contexts/theme/components'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { NFTStatus } from '@/pages/staking/components/NftStakingPoolCard'
import { useResponsive } from '@/contexts/theme'

const StyledNftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(247, 247, 247);
  background-size: 100%;
  border-radius: 20px;
  padding-bottom: 8px;
`

const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export type OperableNftCardProps = NFTStakingPoolConfig & MetadataResult & {
  type: NFTStatus
}

const OperableNftCard: React.FC<OperableNftCardProps> = props => {
  const { data, account, type, ...rest } = props
  const { deposit, withdraw } = useNFTStaking(rest)
  const { isMobile } = useResponsive()
  const [loaded, setLoaded] = useState(false)

  return (
    <StyledNftCard isSuccess width={'100%'}>
      {
        !loaded && (
          <Skeleton width={'100%'} height={'258px'} />
        )
      }
      <NFTImage src={data?.image} alt="" onLoad={() => setLoaded(true)} style={{ display: !loaded ? 'none' : '' }} />
      <Text fontWeight={600} fontSize={isMobile ? '16px' : '20px'} color={'primary'} m={'6px 0'}>{account?.data.data.name}</Text>
      {
        type === 'deposited'
          ? (
            <Button scale={'sm'} variant={'primaryContrary'} onClick={() => withdraw(props)}>Withdraw</Button>
          ) : (
            <Button scale={'sm'} variant={'primaryContrary'} onClick={() => deposit(props)}>Deposit</Button>
          )
      }
    </StyledNftCard>
  )
}

const InoperableNftCard: React.FC<MetadataResult> = ({ data, account }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <StyledNftCard isSuccess width={'100%'}>
      {
        !loaded && (
          <Skeleton width={'100%'} height={'258px'} />
        )
      }
      <NFTImage src={data?.image} alt="" onLoad={() => setLoaded(true)} style={{ display: !loaded ? 'none' : '' }} />
      <Text fontWeight={700} fontSize={'16px'} color={'primary'} m={'8px 0'}>{account?.data.data.name}</Text>
    </StyledNftCard>
  )
}

export { OperableNftCard, InoperableNftCard }
