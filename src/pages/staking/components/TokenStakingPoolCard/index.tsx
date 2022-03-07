import React from 'react'
import {
  CurrencyIconImage,
  CurrencyName,
  InfoGrid,
  StyledTokenStakingPoolCard
} from '@/pages/staking/components/TokenStakingPoolCard/index.styles'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'
import { useTokenStaking } from '@/hooks/programs/useStaking'
import { TokenStakingPoolConfig } from '@/hooks/programs/useStaking/constants/token'
import { ClipLoader } from 'react-spinners'

const Loader = () => <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />

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

        <CurrencyName>{currencies.map(c => c.name).join(' / ')}</CurrencyName>
      </Flex>

      <InfoGrid>
        <Text>
          {'Total Deposits: '}
          {
            totalDeposited.isLoading
              ? <Loader />
              : (totalDeposited.data?.toFixed(4) || '-')
          }
        </Text>

        <Text>
          {'APR: '}
          {
            APR.isLoading ? (
              <Loader />
            ) : (
              APR.data
                ? `${APR.data.APR.multipliedBy(100)?.toFixed(2)}% (${APR.data.totalRewardsPerDay.toFixed(9)}/day)`
                : '-'
            )
          }
        </Text>

        <Text>
          {'Your Deposits: '}
          {
            userDeposited.isLoading
              ? <Loader />
              : (userDeposited.data?.toFixed(4) || '-')
          }
        </Text>

        <Text>
          {'Available Rewards: '}
          {
            availableRewards.isLoading
              ? <Loader />
              : (availableRewards.data?.toFixed(4) || '-')
          }
        </Text>
      </InfoGrid>

      <Flex row justifySpaceBetween>
        <Button onClick={deposit}>Deposit</Button>
        <Button onClick={withdraw}>Withdraw</Button>
        <Button onClick={harvest}>Harvest</Button>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
