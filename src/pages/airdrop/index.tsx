import React from 'react'
import { AirdropPageContainer } from '@/pages/airdrop/index.styles'
import { Introductions, PersonalInfo, UserVotedGrants } from '@/pages/airdrop/modules'
import { UserHoldNFTs } from '@/pages/airdrop/modules/UserHoldNFTs'
import styled from 'styled-components'

const Grid = styled.div`
  margin-top: 48px;
  display: flex;
  width: 100%;

  .user-voted-grants {
    flex: 1;
    margin-right: 48px;
  }

  @media screen and (max-width: 1334px) {
    flex-direction: column;

    .user-hold-NFTs {
      margin-top: 32px;
    }
  }
`

const AirdropPage: React.FC = () => {
  return (
    <AirdropPageContainer>
      <Introductions />
      <PersonalInfo />
      <Grid>
        <UserVotedGrants />
        <UserHoldNFTs />
      </Grid>
    </AirdropPageContainer>
  )
}

export default AirdropPage
