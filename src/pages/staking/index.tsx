import React, { useState } from 'react'
import { StakingPageContainer } from '@/pages/staking/index.styles'
import { ButtonMenu } from '@/contexts/theme/components'
import TokenStakingModule from '@/pages/staking/modules/token-staking'

const StakingPage: React.FC = () => {
  const [key, setKey] = useState('token')

  return (
    <StakingPageContainer>
      <ButtonMenu activeKey={key} onItemClick={({ key }) => setKey(key!)} mb={'32px'}>
        <ButtonMenu.Item key={'token'}>Token</ButtonMenu.Item>
        <ButtonMenu.Item key={'nft'}>NFT</ButtonMenu.Item>
      </ButtonMenu>

      {
        key === 'token' ? <TokenStakingModule /> : (<div />)
      }
    </StakingPageContainer>
  )
}

export default StakingPage
