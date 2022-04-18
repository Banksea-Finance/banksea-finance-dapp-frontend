import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Button, Tabs, Text } from '@/contexts/theme/components'
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
import QueriedData from '@/components/QueriedData'
import { useSolanaWeb3 } from '@/contexts'

const NftStakingPoolCard: React.FC<NFTStakingPoolConfig> = props => {
  const { logo, name, creator, rewardTokenName } = props

  const { isMobile } = useResponsive()
  const [key, setKey] = useState('hold')
  const holds = useOwnedNFTsQuery(creator)
  const { account } = useSolanaWeb3()
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
    <StyledNftStakingPoolCard flexDirection={'column'}>
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
          displayFunction={data => `${data.toFixed(6)} ${rewardTokenName}/day`}
        />
        <DataItem
          label={'Your Deposited'}
          value={userDeposited}
          displayFunction={data => data?.length.toString()}
        />
        <DataItem
          label={'Your History Harvest'}
          value={userClaimedRewards}
          displayFunction={data => `${data.toFixed(6)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'S' : 'M'}>
          <Tabs.Pane title={'My Stake'} tabKey={'deposit'}>
            <NFTsGridView
              emptyText={'You have not deposited anything'}
              queryResult={userDeposited}
              itemOperation={{
                text: 'Withdraw',
                callback: (nft: MetadataResult) => withdraw(nft)
              }}
            />
          </Tabs.Pane>

          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            {
              account && (
                <Flex alignItemsCenter justifyCenter style={{ width: '100%', marginBottom: '8px' }}>
                  <Text as={'span'} color={'textDisabled'} mr={'2px'}>
                    NFTs you hold: <QueriedData as={'span'} value={holds} color={'textDisabled'} displayFunction={v => v.length.toString()} fontWeight={500} />
                    {' | '}
                  </Text>

                  <Button
                    scale={'S'}
                    p={'0'}
                    ml={'4px'}
                    variant={'text'}
                    as={'a'}
                    href={'https://faucet.banksea.finance'}
                    target={'_blank'}
                    rel={'noreferrer'}
                  >
                    Request airdrop
                  </Button>
                </Flex>
              )
            }

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
