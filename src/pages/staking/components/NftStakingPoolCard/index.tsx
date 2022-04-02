import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Tabs } from '@/contexts/theme/components'
import { StyledNftStakingPoolCard } from './index.styles'
import NFTsGridView from '@/pages/staking/components/NFTsGridView'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { DataItem } from '@/pages/staking/components/DataItem'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '@/pages/staking/components/common.styles'
import { useResponsive } from '@/contexts/theme'

export type NFTStatus = 'deposited' | 'hold'

const NftStakingPoolCard: React.FC<NFTStakingPoolConfig> = props => {
  const { logo, name, creator, rewardTokenName } = props

  const [key, setKey] = useState('hold')
  const holds = useOwnedNFTsQuery(creator)
  const { userDeposited, totalDeposited, userClaimedRewards, rewardsPerDay, userAvailableRewards, claim } = useNFTStaking(props)

  const { isMobile } = useResponsive()

  return (
    <StyledNftStakingPoolCard>
      <StakingPoolHead name={name} icon={logo} availableRewards={userAvailableRewards} rewardTokenName={rewardTokenName} onHarvest={claim} />

      <InfoGrid>
        <DataItem
          label={'Total Deposited'}
          queryResult={totalDeposited}
        />
        <DataItem
          label={'Rewards Per Staking'}
          queryResult={rewardsPerDay}
          displayExpress={data => `${data.toFixed(6)} ${rewardTokenName}/day`}
        />
        <DataItem
          label={'Your Deposited'}
          queryResult={userDeposited}
          displayExpress={data => data?.length.toString()}
        />
        <DataItem
          label={'Your History Harvest'}
          queryResult={userClaimedRewards}
          displayExpress={data => `${data.toFixed(6)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'xs' : 'sm'}>
          <Tabs.Pane title={'My Stake'} tabKey={'deposit'}>
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
