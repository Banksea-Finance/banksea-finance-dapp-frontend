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
        <Text>Total Deposits: {totalDeposited?.toString() || <Loader />}</Text>

        <Text>APR: {APR ? `${APR?.APR.multipliedBy(100)?.toFixed(2)}% (${APR.totalRewardsPerDay.toFixed(2)}/day)` : <Loader />}</Text>

        <Text>Your Deposits: {userDeposited?.toString() || <Loader />}</Text>

        <Text>Available Rewards: {availableRewards?.toFixed(6) || <Loader />}</Text>
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
