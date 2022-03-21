import { Button, Card, Text } from '@/contexts/theme/components'
import React from 'react'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { Flex } from '@react-css/flex'

const StyledNftCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('${require('@/assets/images/citizen-one-bg.png')}');
  padding: 16px 16px 8px 16px;
  border-radius: 32px;
  width: 208px;
`

const NFTImage = styled.img`
  border-radius: 16px;
  width: 100%;
  height: 232px;
  object-fit: cover;
  margin-bottom: 8px;
`

const NftCard: React.FC<MetadataResult> = ({ data }) => {
  return (
    <StyledNftCard className={'nft-card'} plain>
      <NFTImage src={data?.image} alt="" />
      <Text bold fontSize={'24px'} color={'primary'}>
        {data?.name}
      </Text>
    </StyledNftCard>
  )
}

const Container = styled.div`
  width: 644px;

  @media screen and (max-width: 1620px) {
    width: 426px;
  }

  @media screen and (max-width: 1334px) {
    width: 100%;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 208px);
  justify-content: start;
  gap: 10px;
`

export const UserHoldNFTs: React.FC = () => {
  const { data: NFTs } = useOwnedNFTsQuery(NFT_STAKING_POOLS[0].creator)

  return (
    <Container className={'user-hold-NFTs'}>
      <Flex alignItemsCenter style={{ marginBottom: '24px' }}>
        <Text bold important fontSize={'28px'} color={'primary'} mr={'16px'}>
          NFTs you hold
        </Text>
        <Button scale={'sm'} variant={'subtle'}>
          Go to purchase!
        </Button>
      </Flex>
      <Grid>
        {
          NFTs?.map(nft => <NftCard {...nft} key={nft.mint.toString()} />)
        }
      </Grid>
    </Container>
  )
}
