import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Tabs } from '@/contexts/theme/components'
import { StyledNftStakingPoolCard } from './index.styles'
import NFTsGridView from '@/components/NFTsGridView'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { DataItem } from '@/pages/staking/components/DataItem'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '@/pages/staking/components/common.styles'
import { useResponsive } from '@/contexts/theme'
import { MetadataResult } from '@/utils/metaplex/metadata'

export type NFTStatus = 'deposited' | 'hold'

const NftStakingPoolCard: React.FC<NFTStakingPoolConfig> = props => {
  const { logo, name, creator, rewardTokenName } = props

  const { isMobile } = useResponsive()
  const [key, setKey] = useState('hold')
  const holds = useOwnedNFTsQuery(creator)
  const {
    userDeposited,
    totalDeposited,
    userClaimedRewards,
    rewardsPerDay,
    userAvailableRewards,
    claim,
    deposit,
    withdraw
  } = useNFTStaking(props)

  return (
    <StyledNftStakingPoolCard>
      <StakingPoolHead
        name={name}
        icon={logo}
        availableRewards={userAvailableRewards}
        rewardTokenName={rewardTokenName}
        onHarvest={claim}
      />

      <InfoGrid>
        <DataItem
          label={'Total Deposited'}
          value={totalDeposited}
        />
        <DataItem
          label={'Rewards Per Staking'}
          value={rewardsPerDay}
          displayExpress={data => `${data.toFixed(6)} ${rewardTokenName}/day`}
        />
        <DataItem
          label={'Your Deposited'}
          value={userDeposited}
          displayExpress={data => data?.length.toString()}
        />
        <DataItem
          label={'Your History Harvest'}
          value={userClaimedRewards}
          displayExpress={data => `${data.toFixed(6)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'xs' : 'sm'}>
          <Tabs.Pane title={'My Stake'} tabKey={'deposit'}>
            <NFTsGridView
              queryResult={userDeposited}
              itemOperation={{
                text: 'Withdraw',
                callback: (nft: MetadataResult) => withdraw(nft)
              }}
            />
          </Tabs.Pane>

          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <NFTsGridView
              queryResult={holds}
              itemOperation={{
                text: 'Deposit',
                callback: (nft: MetadataResult) => deposit(nft)
              }}
            />
          </Tabs.Pane>
        </Tabs>
      </Flex>
    </StyledNftStakingPoolCard>
  )
}

export default NftStakingPoolCard
