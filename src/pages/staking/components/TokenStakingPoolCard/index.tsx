import React from 'react'
import {
  CurrencyIconImage,
  InfoGrid,
  StyledTokenStakingPoolCard
} from '@/pages/staking/components/TokenStakingPoolCard/index.styles'
import Flex from '@react-css/flex'
import { Button, Card, Text } from '@/contexts/theme/components'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { Grid } from '@react-css/grid'
import { DataItem } from '../DataItem'
import { ClipLoader } from 'react-spinners'
import styled from 'styled-components'

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies, rewardTokenName } = props

  const { deposit, userDeposited, totalDeposited, availableRewards, historyRewardsQuery, APR, withdraw, claim } = useTokenStaking(props)

  return (
    <StyledTokenStakingPoolCard>
      <Flex row justifySpaceBetween alignItemsCenter style={{ marginBottom: '32px' }}>
        <Flex alignItemsCenter>
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

        <Card plain backgroundColor={'secondary'}>
          <Flex alignItemsCenter style={{ padding: '8px 32px', borderRadius: '40px' }}>
            <Text mr={'16px'} fontSize={'18px'} bold color={'textContrary'}>
              {'Available rewards: '}
              {
                availableRewards.data
                  ? `${availableRewards.data?.toFixed(6)} ${rewardTokenName}`
                  : (availableRewards.isFetching
                    ? <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
                    : '-'
                  )
              }
            </Text>
            <Button scale={'sm'} onClick={claim} variant={'primaryContrary'}>Harvest</Button>
          </Flex>
        </Card>
      </Flex>

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
        <Grid gap={'20px'} columns={'repeat(3, 1fr)'}>
          <Button onClick={deposit} scale={'sm'}>
            Deposit
          </Button>
          <Button onClick={withdraw} scale={'sm'}>
            Withdraw
          </Button>
        </Grid>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
