import React from 'react'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import NftCard from '@/pages/staking/components/NftCard'
import { useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { NFTStatus } from '@/pages/staking/components/NftStakingPoolCard'

const Grid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 258px);
  gap: 10px 48px;
`

export type NFTsGridViewProps = NFTStakingPoolConfig & {
  list?: MetadataResult[]
  type: NFTStatus
}

const NFTsGridView: React.FC<NFTsGridViewProps> = ({ list, type, ...rest }) => {
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
        <NftCard type={type} {...rest} {...o} key={o.mint.toBase58()} />
      ))}
    </Grid>
  )
}

export default NFTsGridView
