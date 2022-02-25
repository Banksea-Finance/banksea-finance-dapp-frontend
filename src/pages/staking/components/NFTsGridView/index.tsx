import React from 'react'
import styled from 'styled-components'
import { MetadataResult } from '@/hooks/programs/useCandyMachine/helpers/metadata'
import NftCard from '@/pages/staking/components/NftCard'
import { useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'

const Grid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 345px);
  gap: 10px 20px;
`

export type NFTsGridViewProps = {
  list?: MetadataResult[]
  type: 'deposit' | 'hold'
}

const NFTsGridView: React.FC<NFTsGridViewProps> = ({ list, type }) => {
  const { account } = useSolanaWeb3()

  if (!account) {
    return  (
      <Text bold fontSize={'24px'} textAlign={'center'}>
        Please connect to wallet first.
      </Text>
    )
  }

  if (!list?.length) {
    return  (
      <Text bold fontSize={'24px'} textAlign={'center'}>
        You have NOT {type} anyone.
      </Text>
    )
  }


  return (
    <Grid>
      {list?.map(o => (
        <NftCard {...o} key={o.mint.toBase58()} />
      ))}
    </Grid>
  )
}

export default NFTsGridView
