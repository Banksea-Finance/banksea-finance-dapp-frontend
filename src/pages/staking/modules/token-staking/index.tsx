import React from 'react'
import TokenStakingPoolCard from '@/pages/staking/components/TokenStakingPoolCard'
import styled from 'styled-components'
import { TOKEN_STAKING_POOLS } from '@/pages/staking/modules/token-staking/constant'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 45%);
  gap: 50px;
  width: 100%;

  justify-content: center;
`

const TokenStakingModule: React.FC = () => {
  return (
    <Container>
      {TOKEN_STAKING_POOLS.map((pool, index) => (
        <TokenStakingPoolCard {...pool} key={index} />
      ))}
    </Container>
  )
}

export default TokenStakingModule
