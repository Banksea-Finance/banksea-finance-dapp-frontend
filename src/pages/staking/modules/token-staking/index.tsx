import React from 'react'
import TokenStakingPoolCard from '@/pages/staking/components/TokenStakingPoolCard'
import styled from 'styled-components'
import { TOKEN_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/token'

const TokenStakingModuleContainer = styled.div`
  width: 100%;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    width: inherit;
  }
`

const TokenStakingModule: React.FC = () => {
  return (
    <>
      {TOKEN_STAKING_POOLS.map((pool, index) => (
        <TokenStakingPoolCard {...pool} key={index} />
      ))}
    </>
  )
}

export default TokenStakingModule
