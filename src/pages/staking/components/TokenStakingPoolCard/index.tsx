import React from 'react'
import { StyledTokenStakingPoolCard } from './index.styles'
import Flex from '@react-css/flex'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { Grid } from '@react-css/grid'
import { DataItem } from '../DataItem'
import { WalletRequiredButton } from '@/components/WalletRequiredButton'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '../common.styles'
import { Text } from '@/contexts/theme/components'
import QueriedData from '@/components/QueriedData'

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies, rewardTokenName } = props

  const poolName = currencies[0].name

  const {
    deposit,
    userDeposited,
    totalDeposited,
    userAvailableRewards,
    userClaimedRewards,
    APR,
    withdraw,
    claim,
    poolBalance
  } = useTokenStaking(props)

  return (
    <StyledTokenStakingPoolCard>
      <StakingPoolHead
        name={poolName}
        icon={currencies[0].icon}
        availableRewards={userAvailableRewards}
        rewardTokenName={rewardTokenName}
        onHarvest={claim}
      />

      <InfoGrid>
        <DataItem
          label={'Total Deposited'}
          value={totalDeposited}
          displayExpress={data => `${data.toFixed(6)} ${poolName}`}
        />
        <DataItem
          label={'APR'}
          value={APR}
          displayExpress={data => `${data.APR.multipliedBy(100)?.toFixed(2)}%`}
        />
        <DataItem
          label={'Your Deposited'}
          value={userDeposited}
          displayExpress={data => data.toFixed(6)}
        />
        <DataItem
          label={'Your History Harvest'}
          value={userClaimedRewards}
          displayExpress={data => `${data.toFixed(6)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex row justifyCenter>
        <Grid gap={'20px'} columns={'repeat(2, 1fr)'}>
          <WalletRequiredButton onClick={deposit} scale={'sm'}>
            Deposit
          </WalletRequiredButton>
          <WalletRequiredButton onClick={withdraw} scale={'sm'}>
            Withdraw
          </WalletRequiredButton>
        </Grid>
      </Flex>
      <Text textAlign={'center'} color={'textDisabled'} mt={'16px'}>
        Your Balance: <QueriedData as={'span'} value={poolBalance} color={'textDisabled'} /> KSE
      </Text>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
