import React from 'react'
import { Card, CardRibbon, Dialog, Flex, Grid, Text, useModal } from '@banksea-finance/ui-kit'
import { useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'
import { RegisterGrantDialog } from '@/pages/airdrop/components/RegisterGrantDialog'
import { GrantsCanBeRegister, RegisterGrantConfig } from '@/pages/airdrop/constant'
import styled from 'styled-components'

const GrantCard: React.FC<RegisterGrantConfig & { registered?: boolean }> = props => {
  const { name, image, registered } = props

  const { openModal } = useModal()

  return (
    <Card
      flexDirection={'column'}
      onClick={() => {
        if (registered) return
        openModal(<RegisterGrantDialog {...props} />)
      }}
      p={'0 0 4px 0'}
      ribbon={
        registered ? (
          <CardRibbon text={'Registered'} textStyle={{ fontSize: '16px', bold: true, color: 'textContrary' }} />
        ) : undefined
      }
      // isSuccess={registered}
      // activeOnHover={!registered}
      style={{ cursor: registered ? 'not-allowed' : 'pointer' }}
    >
      <img src={image} alt={name} style={{ width: '350px', height: '160px', borderBottom: '1.5px #ccc solid' }} />
      <Flex ai={'center'} jc={'center'}>
        <Text textAlign={'center'} fontSize={'18px'} bold mt={'4px'}>
          {name}
        </Text>
      </Flex>
    </Card>
  )
}

const StyledGrid = styled(Grid)`
  grid-template-columns: repeat(2, 350px);
  gap: 24px;
  
  ${({ theme }) => theme.mediaQueries.maxXl} {
    justify-content: center;
    grid-template-columns: 350px;
  }
`

export const AllGrantsDialog: React.FC = () => {
  const { data: userByWallet } = useUserByWalletQuery()

  return (
    <Dialog
      plain
      title={'All grants we participated:'}
    >
      <StyledGrid>
        {GrantsCanBeRegister.map(grant => (
          <GrantCard
            {...grant}
            registered={userByWallet?.builds.map(g => g.grant).includes(grant.grantKey)}
            key={grant.grantKey}
          />
        ))}
      </StyledGrid>
    </Dialog>
  )
}
