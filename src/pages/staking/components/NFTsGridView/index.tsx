import React from 'react'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { NFTStatus } from '@/pages/staking/components/NftStakingPoolCard'
import { UseQueryResult } from 'react-query'
import { PropagateLoader } from 'react-spinners'
import { Flex } from '@react-css/flex'
import { OperableNftCard } from '@/pages/staking/components/NftCard'

const Grid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 258px);
  gap: 10px 48px;
`

export type NFTsGridViewProps = NFTStakingPoolConfig & {
  queryResult: UseQueryResult<MetadataResult[] | undefined>
  type: NFTStatus
}

const NFTsGridView: React.FC<NFTsGridViewProps> = ({ queryResult, type, ...rest }) => {
  const { account } = useSolanaWeb3()

  if (!account) {
    return (
      <Text bold fontSize={'24px'} textAlign={'center'}>
        Please connect to wallet first.
      </Text>
    )
  }

  if (queryResult.isLoading || queryResult.data === undefined) {
    return (
      <Flex justifyCenter style={{ margin: '16px 0 56px 0' }}>
        <PropagateLoader size={32} color={'#abc'}  />
      </Flex>
    )
  }

  if (!queryResult.data?.length) {
    return (
      <Text bold fontSize={'24px'} textAlign={'center'}>
        You have NOT {type} anyone.
      </Text>
    )
  }

  return (
    <Grid>
      {queryResult.data.map(o => (
        <OperableNftCard type={type} {...rest} {...o} key={o.mint.toBase58()} />
      ))}
    </Grid>
  )
}

export default NFTsGridView
