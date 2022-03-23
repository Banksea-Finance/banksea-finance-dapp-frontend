import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Button, Card, Text } from '@/contexts/theme/components'
import {
  GridContainer,
  NftCollectionImage,
  StyledNftStakingPoolCard
} from '@/pages/staking/components/NftStakingPoolCard/index.styles'
import Tabs from '@/contexts/theme/components/Tabs/Tabs'
import NFTsGridView from '@/pages/staking/components/NFTsGridView'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { ClipLoader } from 'react-spinners'
import { DataItem } from '@/pages/staking/components/DataItem'

export type NFTStatus = 'deposited' | 'hold'

const Loader = () => <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />

const NftStakingPoolCard: React.FC<NFTStakingPoolConfig> = props => {
  const { logo, name, creator, rewardTokenName } = props

  const [key, setKey] = useState('deposit')
  const holds = useOwnedNFTsQuery(creator)
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

        <Card plain backgroundColor={'secondary'}>
          <Flex alignItemsCenter style={{ padding: '8px 32px', borderRadius: '40px' }}>
            <Text mr={'16px'} fontSize={'18px'} bold color={'textContrary'}>
              {'Available rewards: '}
              {
                availableRewards.isLoading
                  ? <Loader />
                  : (
                    availableRewards.data
                      ? `${availableRewards.data?.toFixed(6)} ${rewardTokenName}`
                      : '-'
                  )
              }
            </Text>
            <Button scale={'sm'} onClick={claim} variant={'primaryContrary'}>Harvest</Button>
          </Flex>
        </Card>
      </Flex>

      <Flex row justifyCenter alignItemsCenter style={{ marginBottom: '48px', padding: '0 16px' }}>
        <GridContainer>
          <DataItem
            label={'Total Deposits'}
            loading={totalDeposited.isLoading}
            value={totalDeposited?.data?.toString() || '-'}
          />
          <DataItem
            label={'Your Total Rewards'}
            loading={userTotalRewards.isLoading}
            value={userTotalRewards.data ? `${userTotalRewards.data.toFixed(6)} ${rewardTokenName}` : '-'}
          />

          <DataItem
            label={'Your Deposited'}
            loading={userDeposited.isLoading}
            value={userDeposited.data ? userDeposited?.data?.length.toString() : '-'}
          />

          <DataItem
            label={'Rewards Per Staking'}
            loading={rewardsPerDay.isLoading}
            value={rewardsPerDay.data ? `${rewardsPerDay.data.toFixed(6)} ${rewardTokenName}/day` : '-'}
          />
        </GridContainer>
      </Flex>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'}>
          <Tabs.Pane title={'My Deposit'} tabKey={'deposit'}>
            <NFTsGridView {...props} queryResult={userDeposited} type={'deposited'} />
          </Tabs.Pane>

          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <NFTsGridView {...props} queryResult={holds} type={'hold'} />
          </Tabs.Pane>
        </Tabs>
      </Flex>
    </StyledNftStakingPoolCard>
  )
}

export default NftStakingPoolCard
