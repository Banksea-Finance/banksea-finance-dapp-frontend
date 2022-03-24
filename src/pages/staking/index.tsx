import React from 'react'
import TokenStakingModule from '@/pages/staking/modules/token-staking'
import NFTStakingModule from '@/pages/staking/modules/nft-staking'
import styled from 'styled-components'
import DefaultPageContainer from '@/components/default-page-container'

const StakingPageContainer = styled(DefaultPageContainer)`
  display: grid;
  gap: 32px;
`

const StakingPage: React.FC = () => {
  return (
    <StakingPageContainer>
      <TokenStakingModule />
      <NFTStakingModule />
    </StakingPageContainer>
  )
}

export default StakingPage
