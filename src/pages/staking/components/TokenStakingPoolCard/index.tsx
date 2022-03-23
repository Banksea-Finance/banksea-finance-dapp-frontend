import React from 'react'
import {
  CurrencyIconImage,
  InfoGrid,
  StyledTokenStakingPoolCard
} from '@/pages/staking/components/TokenStakingPoolCard/index.styles'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { Grid } from '@react-css/grid'
import { DataItem } from '../DataItem'

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies } = props

  const { deposit, userDeposited, totalDeposited, availableRewards, APR, withdraw, harvest } = useTokenStaking(props)

  return (
    <StyledTokenStakingPoolCard>
      <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
        {currencies.map((c, index) => {
          return index === currencies.length - 1 ? (
            <CurrencyIconImage src={c.icon} key={index} />
          ) : (
            <Flex key={index} alignItemsCenter>
              <CurrencyIconImage src={c.icon} />
              <Text m={'0 4px'} fontSize={'32px'}>
                /
              </Text>
            </Flex>
          )
        })}

        <Text ml={'16px'} bold fontSize={'24px'}>
          {currencies.map(c => c.name).join(' / ')}
        </Text>
      </Flex>

      <InfoGrid>
        <DataItem
          label={'Total Deposits'}
          loading={totalDeposited.isLoading}
          value={totalDeposited.data?.toFixed(6) || '-'}
        />
        <DataItem
          label={'APR'}
          loading={APR.isLoading}
          value={
            APR.data
              ? `${APR.data.APR.multipliedBy(100)?.toFixed(2)}% (${APR.data.totalRewardsPerDay.toFixed(6)}/day)`
              : '-'
          }
        />
        <DataItem
          label={'Your Deposits'}
          loading={userDeposited.isLoading}
          value={userDeposited.data?.toFixed(6) || '-'}
        />
        <DataItem
          label={'Available Rewards'}
          loading={availableRewards.isLoading}
          value={availableRewards.data?.toFixed(6) || '-'}
        />
      </InfoGrid>

      <Flex row justifyCenter>
        <Grid gap={'20px'} columns={'repeat(3, 1fr)'}>
          <Button onClick={deposit} scale={'sm'}>
            Deposit
          </Button>
          <Button onClick={withdraw} scale={'sm'}>
            Withdraw
          </Button>
          <Button onClick={harvest} scale={'sm'}>
            Harvest
          </Button>
        </Grid>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
