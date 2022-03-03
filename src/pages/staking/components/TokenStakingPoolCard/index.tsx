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

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = props => {
  const { currencies } = props

  const { deposit, userDeposited, totalDeposited, totalRewards, APR, withdraw, harvest } = useTokenStaking(props)

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
        <Text>Total Deposits: {totalDeposited?.toString() || '-'}</Text>

        <Text>APR: {APR ? `${APR?.multipliedBy(100)?.toFixed(2)}%` : '-'}</Text>

        <Text>Your Deposits: {userDeposited?.toString() || '-'}</Text>

        <Text>Your Total Rewards: {totalRewards?.toString() || '-'}</Text>
      </InfoGrid>

      <Flex row justifySpaceBetween>
        <Button onClick={deposit}>Deposit</Button>
        <Button onClick={withdraw}>Withdraw</Button>
        <Button onClick={harvest}>Claim</Button>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
