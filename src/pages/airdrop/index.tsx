import React from 'react'
import { AirdropPageContainer } from '@/pages/airdrop/index.styles'
import { Introductions, PersonalInfo, UserVotedGrants } from '@/pages/airdrop/modules'
import styled from 'styled-components'
import { Card } from '@banksea-finance/ui-kit'
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

export const AirdropPage: React.FC = () => {
  const { data: userByWallet } = useUserByWalletQuery()

  return (
    <AirdropPageContainer>
      <Card p={'24px'} flexDirection={'column'}>
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
            </StyledCard>
          ) : <></>
      }
    </AirdropPageContainer>
  )
}
