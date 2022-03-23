import React from 'react'
import { AirdropPageContainer } from '@/pages/airdrop/index.styles'
import { Introductions, PersonalInfo, UserVotedGrants } from '@/pages/airdrop/modules'
import { UserHoldNFTs } from '@/pages/airdrop/modules/UserHoldNFTs'
import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'
import { COLUMN_LAYOUT_WIDTH_THRESHOLD } from './constant'
import { useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;

  .user-voted-grants {
    flex: 1;
    margin-right: 48px;
  }

  @media screen and (max-width: ${COLUMN_LAYOUT_WIDTH_THRESHOLD}px) {
    flex-direction: column;

    .user-hold-NFTs {
      margin-top: 32px;
    }
  }
`

const AirdropPage: React.FC = () => {
  const { data: userByWallet } = useUserByWalletQuery()

  return (
    <AirdropPageContainer>
      <Card p={'24px'}>
        <Introductions />
        <div style={{ padding: '0 24px' }}>
          <PersonalInfo />
        </div>
      </Card>

      {
        userByWallet?.username
          ? (
            <StyledCard p={'24px'}>
              <UserVotedGrants />
              <UserHoldNFTs />
            </StyledCard>
          ) : <></>
      }
    </AirdropPageContainer>
  )
}

export default AirdropPage
