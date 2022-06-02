import { Button, Flex, Skeleton, Text } from '@banksea-finance/ui-kit'
import React from 'react'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'
import styled from 'styled-components'
import { COLUMN_LAYOUT_WIDTH_THRESHOLD } from '../constant'
import { NFTCard } from '@/components/NFTCard'

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
      <Flex ai={'center'} mb={'24px'}>
        <Text bold important fontSize={'28px'} color={'primary'} mr={'16px'}>
          NFTs you hold
        </Text>
        <Button scale={'M'} variant={'secondary'}>
          Go to purchase!
        </Button>
      </Flex>
      <Grid>
        {
          isLoading
            ? new Array(3).fill(undefined).map((o, i) => <Skeleton width={208} height={272} borderRadius={'20px'} key={`UserHoldNFTs-Skeleton-${i}`} />)
            : NFTs?.map(nft => <NFTCard {...nft} key={nft.mint.toString()} />)
        }
      </Grid>
    </Container>
  )
}
