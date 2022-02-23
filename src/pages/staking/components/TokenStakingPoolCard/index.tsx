import React from 'react'
import {
  CurrencyIconImage,
  CurrencyName, InfoGrid,
  StyledTokenStakingPoolCard
} from '@/pages/staking/components/TokenStakingPoolCard/index.styles'
import { PublicKey } from '@solana/web3.js'
import Flex from '@react-css/flex'
import { Button, Text } from '@/contexts/theme/components'

export type Currency = {
  name: string
  icon: string
}

export type TokenStakingPoolConfig = {
  currencies: [Currency] | [Currency, Currency]
  poolPublicKey: PublicKey
}

const TokenStakingPoolCard: React.FC<TokenStakingPoolConfig> = ({ currencies }) => {
  return (
    <StyledTokenStakingPoolCard>
      <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
        {
          currencies.map((c, index) => {
            return index === currencies.length - 1 ? (
              <CurrencyIconImage src={c.icon} key={c.name} />
            ) : (
              <>
                <CurrencyIconImage src={c.icon} key={c.name} />
                <Text m={'0 4px'} fontSize={'32px'}>/</Text>
              </>
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
        <Text>Total Deposit: 91,778</Text>
        <Text>Total Deposit: 91,778</Text>
        <Text>Total Deposit: 91,778</Text>
        <Text>Total Deposit: 91,778</Text>
      </InfoGrid>

      <Flex row justifySpaceBetween>
        <Button>Deposit</Button>
        <Button>Withdraw</Button>
        <Button>Claim</Button>
      </Flex>
    </StyledTokenStakingPoolCard>
  )
}

export default TokenStakingPoolCard
