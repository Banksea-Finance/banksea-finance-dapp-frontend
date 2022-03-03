import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'
import {
  NftCollectionImage,
  StyledNftStakingPoolCard
} from '@/pages/staking/components/NftStakingPoolCard/index.styles'
import styled from 'styled-components'
import Tabs from '@/contexts/theme/components/Tabs/Tabs'
import NFTsGridView from '@/pages/staking/components/NFTsGridView'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useNFTStaking } from '@/hooks/programs/useStaking'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, max-content));
  gap: 10px 40px;
`

export type NFTStatus = 'deposited' | 'hold'

const NftStakingPoolCard: React.FC<NFTStakingPoolConfig> = props => {
  const { logo, name, creator, rewardTokenName } = props

  const [key, setKey] = useState('deposit')

  const { data: holds } = useOwnedNFTsQuery(creator)

  const { userDeposited, totalDeposited, userTotalRewards, rewardsPerDay, availableRewards, claim } = useNFTStaking(props)

  return (
    <StyledNftStakingPoolCard>
      <Flex justifySpaceBetween alignItemsCenter style={{ marginBottom: '48px' }}>
        <Flex row alignItemsCenter>
          <NftCollectionImage src={logo} />
          <Text fontSize={'28px'} bold>
            {name}
          </Text>
        </Flex>

        <Flex alignItemsCenter style={{ background: 'rgb(25,66,101)', padding: '8px 32px', borderRadius: '40px' }}>
          <Text mr={'16px'} fontSize={'22px'} bold>Available rewards: {availableRewards ? `${availableRewards.toFixed(6)} ${rewardTokenName}` : '-'}</Text>
          <Button scale={'md'} onClick={claim}>Harvest</Button>
        </Flex>
      </Flex>
      <Flex row justifyCenter alignItemsCenter style={{ marginBottom: '48px', padding: '0 16px' }}>
        <GridContainer>
          <Text>Total Deposited: {totalDeposited ?? '-'}</Text>
          <Text>Your Total Rewards: {userTotalRewards ? `${userTotalRewards.toFixed(6)} ${rewardTokenName}` : '-'}</Text>
          <Text>Your Deposited: {userDeposited?.length ?? '-'}</Text>
          <Text>Rewards Per Staking: {rewardsPerDay ? `${rewardsPerDay.toFixed(6)} ${rewardTokenName}/day` : '-'}</Text>
        </GridContainer>
      </Flex>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'}>
          <Tabs.Pane title={'My Deposited'} tabKey={'deposit'}>
            <NFTsGridView {...props} list={userDeposited} type={'deposited'} />
          </Tabs.Pane>
          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <NFTsGridView {...props} list={holds} type={'hold'} />
          </Tabs.Pane>
        </Tabs>
      </Flex>
    </StyledNftStakingPoolCard>
  )
}

export default NftStakingPoolCard
