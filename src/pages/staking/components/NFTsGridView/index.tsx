import React from 'react'
import styled from 'styled-components'
import { MetadataResult } from '@/hooks/programs/useCandyMachine/helpers/metadata'
import NftCard from '@/pages/staking/components/NftCard'

const Grid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 345px);
  gap: 10px 20px;
`

const NFTsGridView: React.FC<{ list?: MetadataResult[]}> = ({ list }) => {

  return (
    <Grid>
      {list?.map(o => (
        <NftCard {...o} key={o.mint.toBase58()} />
      ))}
    </Grid>
  )
}

export default NFTsGridView
