import React, { useState } from 'react'
import { Card, Checkbox, Skeleton, Text } from '@/contexts/theme/components'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useResponsive } from '@/contexts/theme'
import { CheckboxProps } from '@/contexts/theme/components/Checkbox'

const StyledNftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(247, 247, 247);
  background-size: 100%;
  border-radius: 20px;
  padding-bottom: 8px;
  cursor: pointer;

  .nftcard-checkbox {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  &:hover {
    transform: scale(101.5%);
  }
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

export interface NftCardProps extends MetadataResult, CheckboxProps {
  operate?: NftCardOperate
}

export const NftCard: React.FC<NftCardProps> = props => {
  const { data, account, checked, onChange } = props
  const { isMobile } = useResponsive()
  const [loaded, setLoaded] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <StyledNftCard
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      isSuccess
      width={'100%'}
      onClick={() => onChange?.({} as any)}
    >
      {!loaded && <Skeleton width={'100%'} height={'258px'} />}
      <NFTImage src={data?.image} alt="" onLoad={() => setLoaded(true)} style={{ display: !loaded ? 'none' : '' }} />
      <Text fontWeight={600} fontSize={isMobile ? '16px' : '20px'} color={'primary'} m={'6px 0'}>
        {account?.data.data.name}
      </Text>

      <Checkbox
        checked={checked}
        onChange={() => {}}
        scale={'L'}
        className={'nftcard-checkbox'}
        style={{ display: !checked && !hover ? 'none' : '' }}
      />
      {/*{*/}
      {/*  operate && (*/}
      {/*    <Button scale={'M'} variant={'primaryContrary'} onClick={() => operate.callback(props)}>*/}
      {/*      {operate.text}*/}
      {/*    </Button>*/}
      {/*  )*/}
      {/*}*/}
    </StyledNftCard>
  )
}
