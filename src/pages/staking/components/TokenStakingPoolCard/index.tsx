import React from 'react'
import { StyledTokenStakingPoolCard } from './index.styles'
import Flex from '@react-css/flex'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { Grid } from '@react-css/grid'
import { DataItem } from '../DataItem'
import { WalletRequiredButton } from '@/components/wallet-required-button'
import { StakingPoolHead } from '@/pages/staking/components/StakingPoolHead'
import { InfoGrid } from '../common.styles'

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies, rewardTokenName } = props

  const { deposit, userDeposited, totalDeposited, availableRewards, historyRewardsQuery, APR, withdraw, claim } =
    useTokenStaking(props)

  return (
    <StyledTokenStakingPoolCard>
      <StakingPoolHead
        name={currencies[0].name}
        icon={currencies[0].icon}
        availableRewards={availableRewards}
        rewardTokenName={rewardTokenName}
        onHarvest={claim}
      />

      <InfoGrid>
        <DataItem
          label={'Total Deposits'}
          queryResult={totalDeposited}
          displayExpress={data => data.toFixed(6)}
          // labelWidth={'108px'}
        />
        <DataItem
          label={'APR'}
          queryResult={APR}
          displayExpress={data =>
            `${data.APR.multipliedBy(100)?.toFixed(2)}% (${data.totalRewardsPerDay.toFixed(6)}/day)`}
          // labelWidth={'139px'}
        />
        <DataItem
          label={'Your Deposits'}
          queryResult={userDeposited}
          displayExpress={data => data.toFixed(6)}
          // labelWidth={'108px'}
        />
        <DataItem
          label={'Your History Total Rewards'}
          queryResult={historyRewardsQuery}
          displayExpress={data => data.toFixed(6)}
          // labelWidth={'139px'}
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
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
