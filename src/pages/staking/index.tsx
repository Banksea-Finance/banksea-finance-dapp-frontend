import React from 'react'
import styled from 'styled-components'
import DefaultPageContainer from '@/components/DefaultPageContainer'
import { TOKEN_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/token'
import TokenStakingPoolCard from '@/pages/staking/components/TokenStakingPoolCard'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'
import NftStakingPoolCard from '@/pages/staking/components/NftStakingPoolCard'

const StakingPageContainer = styled(DefaultPageContainer)`
  display: grid;
  gap: 32px;

  min-width: 375px;
  overflow-x: auto;

  ${({ theme }) => theme.mediaQueries.xl} {
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
          <NftStakingPoolCard {...p} key={index} />
        ))
      }
    </StakingPageContainer>
  )
}
