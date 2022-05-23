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
import { useSolanaWeb3 } from '@/contexts'
import { AprSvg, HistoryHarvestSvg, TotalDepositedSvg, UserDepositedSvg } from '@/components/svgs'

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies, rewardTokenName } = props
  const { account } = useSolanaWeb3()

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
    compound,
    poolBalance
  } = useTokenStaking(props)

  return (
    <StyledTokenStakingPoolCard flexDirection={'column'}>
      <StakingPoolHead
        name={poolName}
        icon={currencies[0].icon}
        availableRewards={userAvailableRewards}
        rewardTokenName={rewardTokenName}
        onHarvest={claim}
        onCompound={compound}
      />

      <InfoGrid>
        <DataItem
          icon={<TotalDepositedSvg />}
          variant={'success'}
          label={'Total Deposited'}
          value={totalDeposited}
          displayFunction={data => `${data.toFixed(2)} ${poolName}`}
        />
        <DataItem
          icon={<AprSvg />}
          variant={'secondary'}
          label={'APR'}
          value={APR}
          displayFunction={data => `${data.APR.multipliedBy(100)?.toFixed(2)}%`}
        />
        <DataItem
          icon={<UserDepositedSvg />}
          variant={'primaryContrary'}
          label={'Your Deposited'}
          value={userDeposited}
          displayFunction={data => `${data.toFixed(2)} ${poolName}`}
        />
        <DataItem
          icon={<HistoryHarvestSvg />}
          variant={'danger'}
          label={'Your History Harvest'}
          value={userClaimedRewards}
          displayFunction={data => `${data.toFixed(2)} ${rewardTokenName}`}
        />
      </InfoGrid>

      <Flex row justifyCenter>
        <Grid gap={'20px'} columns={'repeat(2, 1fr)'}>
          <WalletRequiredButton onClick={withdraw} variant={'outlined'}>
            Withdraw
          </WalletRequiredButton>
          <WalletRequiredButton onClick={deposit}>
            Deposit
          </WalletRequiredButton>
        </Grid>
      </Flex>
      {
        account && (
          <Flex alignItemsCenter justifyCenter style={{ width: '100%', marginTop: '16px' }}>
            <Text as={'span'} textAlign={'center'} color={'textDisabled'} mr={'4px'}>
              Your Balance: <QueriedData as={'span'} value={poolBalance} color={'textDisabled'} /> KSE
              {' | '}
            </Text>

            <a href={'https://faucet.banksea.finance'} target={'_blank'} rel={'noreferrer'}>
              <Text color={'subtle'}>Request airdrop</Text>
            </a>
          </Flex>
        )
      }
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
