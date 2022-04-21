import React, { useState } from 'react'
import Flex from '@react-css/flex'
import { Button, Grid, Tabs, Text } from '@/contexts/theme/components'
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

  const [selectedNfts, setSelectedNfts] = useState<MetadataResult[]>([])

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
        <DataItem label={'Total Deposited'} value={totalDeposited} />
        <DataItem
          label={'Rewards Per Staking'}
          value={rewardsPerDay}
          displayFunction={data => `${data.toFixed(6)} ${rewardTokenName}/day`}
        />
        <DataItem label={'Your Deposited'} value={userDeposited} displayFunction={data => data?.length.toString()} />
        <DataItem
          label={'Your History Harvest'}
          value={userClaimedRewards}
          displayFunction={data => `${data.toFixed(6)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex column alignItemsCenter>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'S' : 'M'}>
          <Tabs.Pane title={'My Stake'} tabKey={'deposit'}>
            <Grid gridTemplateColumns={'1fr max-content 1fr'} mb={'16px'} gridGap={'16px'}>
              <div />
              {account && (
                <Text as={'span'} color={'textDisabled'} mr={'2px'}>
                  NFTs you deposited:{' '}
                  <QueriedData
                    as={'span'}
                    value={userDeposited}
                    color={'textDisabled'}
                    displayFunction={v => v.length.toString()}
                    fontWeight={500}
                  />
                </Text>
              )}
              {!!selectedNfts.length && (
                <Button
                  width={'fit-content'}
                  scale={'S'}
                  onClick={() => {
                    withdraw(selectedNfts)
                  }}
                >
                  Withdraw selected
                </Button>
              )}
            </Grid>

            <NFTsGridView queryResult={userDeposited} onCheckedNftsChange={setSelectedNfts} />
          </Tabs.Pane>

          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <Grid gridTemplateColumns={'1fr max-content 1fr'} mb={'16px'} gridGap={'16px'}>
              <div />
              {account && (
                <Flex alignItemsCenter justifyCenter style={{ width: '100%', marginBottom: '8px' }}>
                  <Text as={'span'} color={'textDisabled'} mr={'2px'}>
                    NFTs you hold:{' '}
                    <QueriedData
                      as={'span'}
                      value={holds}
                      color={'textDisabled'}
                      displayFunction={v => v.length.toString()}
                      fontWeight={500}
                    />
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
              )}
              {!!selectedNfts.length && (
                <Button
                  width={'fit-content'}
                  scale={'S'}
                  onClick={() => {
                    deposit(selectedNfts)
                  }}
                >
                  Deposit selected
                </Button>
              )}
            </Grid>

            <NFTsGridView queryResult={holds} onCheckedNftsChange={setSelectedNfts} />
          </Tabs.Pane>
        </Tabs>
      </Flex>
    </StyledNftStakingPoolCard>
  )
}

export default NftStakingPoolCard
