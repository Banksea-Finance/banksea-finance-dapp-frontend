import React from 'react'
import TokenStakingModule from './modules/token-staking'
import styled from 'styled-components'
import DefaultPageContainer from '@/components/default-page-container'
import NFTStakingModule from './modules/nft-staking'

const StakingPageContainer = styled(DefaultPageContainer)`
  display: grid;
  gap: 32px;

  ${({ theme }) => theme.mediaQueries.xl} {
  }
`

const StakingPage: React.FC = () => {
  return (
    <StakingPageContainer className={'StakingPageContainer'}>
      <TokenStakingModule />
      <NFTStakingModule />
    </StakingPageContainer>
  )
}

export default StakingPage
