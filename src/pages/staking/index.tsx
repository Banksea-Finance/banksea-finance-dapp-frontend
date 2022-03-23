import React from 'react'
import { StakingPageContainer } from '@/pages/staking/index.styles'
import TokenStakingModule from '@/pages/staking/modules/token-staking'
import NFTStakingModule from '@/pages/staking/modules/nft-staking'

const StakingPage: React.FC = () => {
  return (
    <StakingPageContainer>
      <TokenStakingModule />
      <NFTStakingModule />
    </StakingPageContainer>
  )
}

export default StakingPage
