import React from 'react'
import { Card, Text } from '@/contexts/theme/components'
import { Grid } from '@react-css/grid'
import { useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'
import { Flex } from '@react-css/flex'
import { CardRibbon } from '@/contexts/theme/components/Card'
import { useModal } from '@/contexts'
import { RegisterGrantDialog } from '@/pages/airdrop/components/RegisterGrantDialog'
import { GrantsCanBeRegister, RegisterGrantConfig } from '@/pages/airdrop/constant'

const GrantCard: React.FC<RegisterGrantConfig & { registered?: boolean }> = props => {
  const { name, image, registered } = props

  const { openModal } = useModal()

  return (
    <Card
      onClick={() => {
        if (registered) return
        openModal(<RegisterGrantDialog {...props} />)
      }}
      p={'0 0 4px 0'}
      ribbon={registered ? <CardRibbon text={'Registered'} textStyle={{ fontSize: '18px', bold: true }} /> : undefined}
      isActive={registered}
      activeOnHover
      style={{ cursor: registered ? 'not-allowed' : 'pointer' }}
    >
      <img src={image} alt={name} style={{ width: '350px' }} />
      <Flex alignItemsCenter justifyCenter>
        <Text textAlign={'center'} fontSize={'18px'} bold mt={'4px'}>
          {name}
        </Text>
      </Flex>
    </Card>
  )
}

export const AllGrantsDialog: React.FC = () => {
  const { data: userByWallet } = useUserByWalletQuery()

  return (
    <Card p={'32px'} plain>
      <Text important fontSize={'32px'} mb={'32px'} color={'primary'} bold>
        All grants we participated:
      </Text>

      <Grid gap={'24px'} columns={'repeat(2, 350px)'}>
        {GrantsCanBeRegister.map(grant => (
          <GrantCard
            {...grant}
            registered={userByWallet?.builds.map(g => g.grant).includes(grant.grantKey)}
            key={grant.grantKey}
          />
        ))}
      </Grid>
    </Card>
  )
}
