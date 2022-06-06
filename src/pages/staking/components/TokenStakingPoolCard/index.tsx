import React from 'react'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { StatisticCard } from '../StatisticCard'
import { WalletRequiredButton } from '@/components/WalletRequiredButton'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '../common.styles'
import { Card, Flex, Grid, Text } from '@banksea-finance/ui-kit'
import { QueriedData } from '@/components/QueriedData'
import { useSolanaWeb3 } from '@/contexts'
import { AprSvg, HistoryHarvestSvg, TotalDepositedSvg, UserSvg } from '@/components/svgs'
import { numberWithCommas } from '@/utils'

export const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies, rewardToken, depositToken } = props
  const { account } = useSolanaWeb3()

  const poolName = currencies[0].name

  const {
    deposit,
    userDeposited,
    totalDeposited,
    userAvailableRewards,
    userDailyRewards,
    APR,
    withdraw,
    claim,
    compound,
    poolBalance,
    endTime,
    ended
  } = useTokenStaking(props)

  return (
    <Card
      flexDirection={'column'}
      backgroundColor={'backgroundSecondary'}
      p={{ lg: '24px 24px 36px 24px', _: '12px 8px' }}
    >
      <StakingPoolHead
        name={poolName}
        icon={currencies[0].icon}
        availableRewards={userAvailableRewards}
        rewardTokenName={rewardToken.name}
        onHarvest={claim}
        onCompound={compound}
        endTime={endTime}
        ended={ended}
      />

      <InfoGrid>
        <StatisticCard
          type={'TOKEN'}
          icon={<TotalDepositedSvg />}
          label={'Total Deposited'}
          description={'All KSE on this staking pool.'}
          value={totalDeposited}
          displayFunction={data => `${numberWithCommas(data)} ${poolName}`}
          background={require('@/assets/images/cards-bg/1.webp')}
        />
        <StatisticCard
          type={'TOKEN'}
          icon={<AprSvg />}
          label={'APR'}
          description={
            <>
              Annual percentage rate. <br />
              note: The total reward rate is fixed, so the `APR` <br />
              will dynamic update according to `Total deposited`.
            </>
          }
          value={APR}
          displayFunction={data => `${numberWithCommas(data.APR.multipliedBy(100))}%`}
          background={require('@/assets/images/cards-bg/2.webp')}
        />
        <StatisticCard
          type={'TOKEN'}
          icon={<UserSvg />}
          label={'Your Deposited'}
          description={'All KSE you have deposited.'}
          value={userDeposited}
          displayFunction={data => `${numberWithCommas(data)} ${poolName}`}
          background={require('@/assets/images/cards-bg/3.webp')}
        />
        <StatisticCard
          type={'TOKEN'}
          icon={<HistoryHarvestSvg />}
          label={'User Daily Rewards'}
          description={
            <>
              Daily rewards are calculated in real <br />
              time according to the $sKSE you have deposited. E.g. If you deposit 3 $sKSE, you will <br />
              receive (3 * APR / 365) $sKSE as a daily rewards.
            </>
          }
          value={userDailyRewards}
          displayFunction={data => `${numberWithCommas(data)} ${rewardToken.name}`}
          background={require('@/assets/images/cards-bg/4.webp')}
        />
      </InfoGrid>

      <Flex jc={'center'}>
        <Grid gridGap={'20px'} gridTemplateColumns={'repeat(2, 1fr)'}>
          <WalletRequiredButton onClick={withdraw} variant={'outlined'}>
            Withdraw
          </WalletRequiredButton>
          <WalletRequiredButton onClick={deposit} disabled={ended}>
            Deposit
          </WalletRequiredButton>
        </Grid>
      </Flex>

      {account && (
        <Text as={'span'} textAlign={'center'} color={'textDisabled'} mr={'4px'} mt={'16px'}>
          Your Balance: <QueriedData as={'span'} value={poolBalance} color={'textDisabled'} /> {depositToken.name}
        </Text>
      )}
    </Card>
  )
}
