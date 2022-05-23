import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { UseQueryResult } from 'react-query'
import { PropagateLoader } from 'react-spinners'
import { Flex } from '@react-css/flex'
import { NftCard, NftCardOperate } from '@/components/NftCard'

const Grid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 258px);
  gap: 24px 48px;

  ${({ theme }) => theme.mediaQueries.md} {
    gap: 16px;
    justify-content: center;

    grid-template-columns: repeat(auto-fill, 232px);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, minmax(42%, 258px));
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(2, 48%);
  }
`

export type NFTsGridViewProps = {
  queryResult: UseQueryResult<MetadataResult[] | undefined>
  itemOperation?: NftCardOperate
  emptyText?: string | React.ReactNode

  onCheckedNftsChange?: (v: MetadataResult[]) => void
}

const NFTsGridView: React.FC<NFTsGridViewProps> = ({ queryResult, itemOperation, emptyText, onCheckedNftsChange }) => {
  const { account } = useSolanaWeb3()

  const [checkedNfts, setCheckedNfts] = useState<Array<MetadataResult>>([])

  const isChecked = useCallback((o: MetadataResult) => {
    return checkedNfts.map(o => o.address.toBase58()).includes(o.address.toBase58())
  }, [checkedNfts])

  const handleChange = useCallback((o: MetadataResult) => {
    if (isChecked(o)) {
      setCheckedNfts(prev => {
        prev.splice(prev.map(o => o.address.toBase58()).indexOf(o.address.toBase58()), 1)
        return [...prev]
      })
    } else {
      setCheckedNfts(prev => {
        return [...prev, o]
      })
    }
  }, [isChecked])

  useEffect(() => {
    onCheckedNftsChange?.(checkedNfts)
  }, [checkedNfts])

  useEffect(() => {
    setCheckedNfts([])
  }, [queryResult.data?.length])

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
      <Text fontWeight={'600'} fontSize={'20px'} textAlign={'center'}>
        {emptyText}
      </Text>
    )
  }

  return (
    <Grid>
      {
        queryResult.data.map(o => (
          <NftCard
            operate={itemOperation}
            {...o}
            key={o.address.toBase58()}
            checked={isChecked(o)}
            onChange={() => handleChange(o)}
          />
        ))
      }
    </Grid>
  )
}

export default NFTsGridView