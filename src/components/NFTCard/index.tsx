import React, { useMemo, useState } from 'react'
import { Card, CardRibbon, Checkbox, CheckboxProps, Skeleton, Text } from '@banksea-finance/ui-kit'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'

export type NftCardOperate = {
  text: string
  callback: (nft: MetadataResult) => void
}

export interface NFTCardProps extends MetadataResult, CheckboxProps {
  operate?: NftCardOperate
}

const StyledNFTCard = styled(Card)`
  display: flex;
  padding: 18px;
  flex-direction: column;
  align-items: center;
  background-size: 100%;
  border-radius: 20px;
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

const MYTHIC_ATTRS: Record<string, string[]> = {
  'Body': ['Gold', 'Brown'],
  'Back': ['E Guitar'],
  'Body Feature': ['Doctor', 'Worker', 'Cheese']
}

export const NFTCard: React.FC<NFTCardProps> = props => {
  const { data, account, checked, onChange } = props
  const [loaded, setLoaded] = useState(false)
  const [hover, setHover] = useState(false)

  const mythicCount = useMemo(() => {
    return data?.attributes?.reduce((total, next) => {
      return total + (MYTHIC_ATTRS[next.trait_type]?.includes(next.value) ? 1 : 0)
    }, 0) || 0
  }, [data])

  return (
    <StyledNFTCard
      activeOnHover
      width={'100%'}
      activeVariant={'primaryContrary'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onChange?.({} as any)}
      variant={checked ? 'primaryContrary' : 'disabled'}
      ribbon={mythicCount > 0 && <CardRibbon position={'topLeft'} variant={'warning'} text={`Mythic x ${mythicCount}`} textStyle={{ bold: true }} />}
    >
      {!loaded && <Skeleton width={'100%'} height={'258px'} />}
      <NFTImage src={data?.image} alt="" onLoad={() => setLoaded(true)} style={{ display: !loaded ? 'none' : '' }} />
      <Text fontWeight={600} important fontSize={{ _: '14px', sm: '16px' }} textAlign={'center'} color={'primaryContrary'} m={'6px 0 0 0'}>
        {account?.data.data.name}
      </Text>

      <Checkbox
        checked={checked}
        onChange={() => {}}
        scale={'L'}
        variant={'primaryContrary'}
        className={'nftcard-checkbox'}
        style={{ display: !checked && !hover ? 'none' : '' }}
      />
    </StyledNFTCard>
  )
}
