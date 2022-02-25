import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'
import {
  NftCollectionImage,
  StyledNftStakingPoolCard
} from '@/pages/staking/components/NftStakingPoolCard/index.styles'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import Tabs from '@/contexts/theme/components/Tabs/Tabs'
import NFTsGridView from '@/pages/staking/components/NFTsGridView'
import { useCitizenOnesWithoutRaritiesQuery } from '@/hooks/queries/useMyCitizenOnesQuery'
import { BankseaNftCollection } from '@/hooks/programs/useCandyMachine/helpers/constant'

export type NftStakingPoolConfig = {
  collectionName: string
  collectionIcon: string
  publicKey: PublicKey
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 0 40px;
`

const NftStakingPoolCard: React.FC<BankseaNftCollection> = props => {
  const { logo, name } = props

  const [key, setKey] = useState('deposit')

  const deposits: any[]  = []
  const { data: holds } = useCitizenOnesWithoutRaritiesQuery(props)

  return (
    <StyledNftStakingPoolCard>
      <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
        <NftCollectionImage src={logo} />
        <Text fontSize={'24px'} bold>
          {name}
        </Text>
      </Flex>
      <Flex row justifySpaceBetween alignItemsCenter style={{ marginBottom: '48px', padding: '0 16px' }}>
        <GridContainer>
          <Text>Total Deposit: 91,778</Text>
          <Text>Total Deposit: 91,1231778</Text>
          <Text>Total Deposit: 978</Text>
          <Text>Total Deposit: 91,3222222778</Text>
        </GridContainer>
        <Button scale={'sm'}>Claim</Button>
      </Flex>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'}>
          <Tabs.Pane title={'My Deposit'} tabKey={'deposit'}>
            <NFTsGridView list={deposits} type={'deposit'} />
          </Tabs.Pane>
          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <NFTsGridView list={holds} type={'hold'} />
          </Tabs.Pane>
        </Tabs>
      </Flex>
    </StyledNftStakingPoolCard>
  )
}

export default NftStakingPoolCard
