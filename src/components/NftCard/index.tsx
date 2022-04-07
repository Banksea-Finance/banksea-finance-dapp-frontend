import React, { useState } from 'react'
import { Button, Card, Skeleton, Text } from '@/contexts/theme/components'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
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

export type NftCardOperate = {
  text: string
  callback: (nft: MetadataResult) => void
}

export type NftCardProps = MetadataResult & {
  operate?: NftCardOperate
}

export const NftCard: React.FC<NftCardProps> = props => {
  const { data, account, operate } = props
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
        operate && (
          <Button scale={'sm'} variant={'primaryContrary'} onClick={() => operate.callback(props)}>
            {operate.text}
          </Button>
        )
      }
    </StyledNftCard>
  )
}

