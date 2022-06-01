import React, { useState } from 'react'
import { Button, Card, Flex, Grid, Tabs, Text, useResponsive } from '@banksea-finance/ui-kit'
import NFTsGridView from '@/components/NFTsGridView'
import { NFTStakingPoolConfig } from '@/hooks/programs/useStaking/constants/nft'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useNFTStaking } from '@/hooks/programs/useStaking'
import { StatisticCard } from '@/pages/staking/components/StatisticCard'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '@/pages/staking/components/common.styles'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { QueriedData } from '@/components/QueriedData'
import { useSolanaWeb3 } from '@/contexts'
import { AprSvg, HistoryHarvestSvg, TotalDepositedSvg, UserSvg } from '@/components/svgs'

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
    <Card
      flexDirection={'column'}
      backgroundColor={'backgroundSecondary'}
      p={{ lg: '24px 24px 36px 24px', _: '12px 8px' }}
    >
      <StakingPoolHead
        name={name}
        icon={logo}
        availableRewards={userAvailableRewards}
        rewardTokenName={rewardTokenName}
        onHarvest={claim}
      />

      <InfoGrid>
        <StatisticCard
          type={'NFT'}
          icon={<TotalDepositedSvg />}
          label={'Total Deposited'}
          description={'All CitizenOne on this staking pool.'}
          value={totalDeposited}
          background={require('@/assets/images/cards-bg/1.webp')}
        />
        <StatisticCard
          type={'NFT'}
          icon={<AprSvg />}
          label={'RRPD'}
          description={
            <>
              Rewards of Rarity Per Day. <br />
              <br />
              CitizenOne are divided into 4 rarity levels: <br />
              <ul style={{ marginLeft: '16px' }}>
                <li>level 1: CitizenOne without Mythic Traits.</li>
                <li>level 2: CitizenOne with 1 Mythic trait.</li>
                <li>level 3: CitizenOne with 2 Mythic Traits. </li>
                <li>level 4: CitizenOne with 3 Mythic Traits. </li>
              </ul>
              <br />
              E.g. If you deposit one CitizenOne at level 1 and another <br />
              at level 2, you will receive (3 * RRPD) KSE as a daily reward. <br />
              <br />
              NOTE: The total reward rate is fixed, so the `RRPD` will <br />
              dynamically update according to `Total Deposited`.
            </>
          }
          value={rewardsPerDay}
          displayFunction={data => `${data.toFixed(6)} KSE`}
          background={require('@/assets/images/cards-bg/2.webp')}
        />
        <StatisticCard
          type={'NFT'}
          icon={<UserSvg />}
          label={'Your Deposited'}
          description={'All CitizenOne you have deposited.'}
          value={userDeposited}
          displayFunction={data => data?.length.toString()}
          background={require('@/assets/images/cards-bg/3.webp')}
        />
        <StatisticCard
          type={'NFT'}
          icon={<HistoryHarvestSvg />}
          label={'Your History Harvest'}
          description={'The your accumulated historical rewards in staking.'}
          value={userClaimedRewards}
          displayFunction={data => `${data.toFixed(6)} ${rewardTokenName}`}
          background={require('@/assets/images/cards-bg/4.webp')}
        />
      </InfoGrid>

      <Flex flexDirection={'column'} ai={'center'}>
        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'S' : 'M'}>
          <Tabs.Pane title={'My Stake'} tabKey={'deposit'}>
            <Grid
              gridTemplateColumns={'1fr max-content 1fr'}
              mb={'16px'}
              gridGap={'16px'}
              height={'32px'}
              alignItems={'center'}
            >
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
            <Grid
              gridTemplateColumns={'1fr max-content 1fr'}
              mb={'24px'}
              gridGap={'16px'}
              height={'32px'}
              ai={'center'}
            >
              <div />

              {account && (
                <Text as={'span'} color={'textDisabled'} mr={'4px'} height={'fit-content'}>
                  NFTs you hold:{' '}
                  <QueriedData
                    as={'span'}
                    value={holds}
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
    </Card>
  )
}

export default NftStakingPoolCard
