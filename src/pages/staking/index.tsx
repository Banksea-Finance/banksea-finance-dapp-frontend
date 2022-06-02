import React from 'react'
import styled from 'styled-components'
import DefaultPageContainer from '@/components/DefaultPageContainer'
import { TOKEN_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/token'
import { TokenStakingPoolCard } from './components/TokenStakingPoolCard'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'
import { NFTStakingPoolCard } from './components/NFTStakingPoolCard'

const StakingPageContainer = styled(DefaultPageContainer)`
  display: grid;
  gap: 32px;

  // TODO: make it effective for all pages
  min-width: 375px;

  ${({ theme }) => theme.mediaQueries.maxXl} {
    width: inherit;
    gap: 16px;
  }
`

export const StakingPage: React.FC = () => {
  return (
    <StakingPageContainer className={'StakingPageContainer'}>
      {
        TOKEN_STAKING_POOLS.map((pool, index) => (
          <TokenStakingPoolCard {...pool} key={index} />
        ))
      }

      {
        NFT_STAKING_POOLS.map((p, index) => (
          <NFTStakingPoolCard {...p} key={index} />
        ))
      }
    </StakingPageContainer>
  )
}
