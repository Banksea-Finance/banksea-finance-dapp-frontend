import React, { useState } from 'react'
import { StakingPageContainer } from '@/pages/staking/index.styles'
import TokenStakingModule from '@/pages/staking/modules/token-staking'
import NFTStakingModule from '@/pages/staking/modules/nft-staking'

const StakingPage: React.FC = () => {
  const [key, setKey] = useState('token')

  return (
    <StakingPageContainer>
      {/*<Tabs activeKey={key} onTabChange={setKey} width={'100%'}>*/}
      {/*  <Tabs.Pane title={'Token'} tabKey={'token'}>*/}
      <TokenStakingModule />
      {/*</Tabs.Pane>*/}
      {/*<Tabs.Pane title={'NFT'} tabKey={'nft'}>*/}
      <NFTStakingModule />
      {/*</Tabs.Pane>*/}
      {/*</Tabs>*/}
    </StakingPageContainer>
  )
}

export default StakingPage
