import { Button, Skeleton, Text } from '@/contexts/theme/components'
import React from 'react'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'
import styled from 'styled-components'
import { Flex } from '@react-css/flex'
import { InoperableNftCard } from '@/pages/staking/components/NftCard'
import { COLUMN_LAYOUT_WIDTH_THRESHOLD } from '../constant'

const Container = styled.div`
  width: ${208 * 3 + 16 * 2}px;

  @media screen and (max-width: 1620px) {
    width: ${208 * 2 + 16}px;
  }

  @media screen and (max-width: ${COLUMN_LAYOUT_WIDTH_THRESHOLD}px) {
    width: 100%;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 208px);
  justify-content: start;
  gap: 16px;
`

export const UserHoldNFTs: React.FC = () => {
  const { data: NFTs, isLoading } = useOwnedNFTsQuery(NFT_STAKING_POOLS[0].creator)

  return (
    <Container className={'user-hold-NFTs'}>
      <Flex alignItemsCenter style={{ marginBottom: '24px' }}>
        <Text bold important fontSize={'28px'} color={'primary'} mr={'16px'}>
          NFTs you hold
        </Text>
        <Button scale={'sm'} variant={'secondary'}>
          Go to purchase!
        </Button>
      </Flex>
      <Grid>
        {
          isLoading
            ? new Array(3).fill(undefined).map((o, i) => <Skeleton width={208} height={272} borderRadius={'20px'} key={`UserHoldNFTs-Skeleton-${i}`} />)
            : NFTs?.map(nft => <InoperableNftCard {...nft} key={nft.mint.toString()} />)
        }
      </Grid>
    </Container>
  )
}
