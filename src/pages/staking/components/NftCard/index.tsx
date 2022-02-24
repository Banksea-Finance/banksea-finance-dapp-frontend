import React from 'react'
import { Button, Card, Text } from '@/contexts/theme/components'
import styled from 'styled-components'
import { MetadataResult } from '@/hooks/programs/useCandyMachine/helpers/metadata'

export type NftCardProps = {
  name: string
  image: string
}

const StyledNftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("${require('@/assets/images/citizen-one-bg.png')}");
  padding: 16px;
  border-radius: 32px;
  width: 258px;
  height: 349px;
`

const NFTImage = styled.img`
  border-radius: 16px;
  width: 100%;
  margin-bottom: 8px;
`

const NftCard: React.FC<MetadataResult> = ({ data }) => {
  return (
    <StyledNftCard>
      <NFTImage src={data?.image} alt="" />
      <Text bold fontSize={'24px'} color={'primary'} mb={'8px'}>{data?.name}</Text>
      <Button scale={'sm'}>Withdraw</Button>
    </StyledNftCard>
  )
}

export default NftCard
