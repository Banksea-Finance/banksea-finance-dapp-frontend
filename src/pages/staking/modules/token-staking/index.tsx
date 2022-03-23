import React from 'react'
import TokenStakingPoolCard from '@/pages/staking/components/TokenStakingPoolCard'
import styled from 'styled-components'
import { TOKEN_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/token'

const Container = styled.div`
  width: 100%;
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
