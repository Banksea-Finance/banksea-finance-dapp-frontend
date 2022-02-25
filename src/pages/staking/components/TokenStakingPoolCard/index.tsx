import React, { useCallback } from 'react'
import {
  CurrencyIconImage,
  CurrencyName,
  InfoGrid,
  StyledTokenStakingPoolCard
} from '@/pages/staking/components/TokenStakingPoolCard/index.styles'
import { PublicKey } from '@solana/web3.js'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'
import { useStaking } from '@/hooks/programs/useStaking'

export type Currency = {
  name: string
  icon: string
}

export type TokenStakingPoolConfig = {
  currencies: [Currency] | [Currency, Currency]
  poolAddress: PublicKey
  whitelists: PublicKey[]
}

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = ({ currencies, poolAddress }) => {
  const { deposit, userDeposit, totalDeposits, userRewards, APY } = useStaking({ type: 'token', poolAddress })

  return (
    <StyledTokenStakingPoolCard>
      <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
        {
          currencies.map((c, index) => {
            return index === currencies.length - 1 ? (
              <CurrencyIconImage src={c.icon} key={index} />
            ) : (
              <Flex key={index} alignItemsCenter>
                <CurrencyIconImage src={c.icon} />
                <Text m={'0 4px'} fontSize={'32px'}>/</Text>
              </Flex>
            )
          })
        }

        <CurrencyName>
          {
            currencies.map(c => c.name).join(' / ')
          }
        </CurrencyName>
      </Flex>

      <InfoGrid>
        <Text>Total Deposits: {totalDeposits}</Text>

        <Text>APY: {APY}</Text>

        <Text>Your deposits: {userDeposit}</Text>

        {/* in passbook */}
        <Text>Your rewards: {userRewards}</Text>
      </InfoGrid>

      <Flex row justifySpaceBetween>
        <Button onClick={deposit}>Deposit</Button>
        <Button>Withdraw</Button>
        <Button>Claim</Button>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
