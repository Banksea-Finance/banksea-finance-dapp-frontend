import React from 'react'
import { Grant, useUserByWalletQuery } from '@/hooks/queries/useUserByWalletQuery'
import { Button, Card, Text } from '@/contexts/theme/components'
import { shortenAddress } from '@/utils'
import { Flex } from '@react-css/flex'
import { useModal } from '@/contexts'
import { AllGrantsDialog } from '@/pages/airdrop/components/AllGrantsDialog'


const VotedGrantCard: React.FC<Grant> = ({ img, totalVotes, name, voterAddress }) => {
  return (
    <Card height={'128px'} p={'12px 8px'} display={'flex'}>
      <img src={img} alt="" style={{ height: '100%', borderRadius: '32px', marginRight: '16px' }} />
      <div style={{ padding: '0', display: 'grid', rowGap: '8px', alignItems: 'center' }}>
        <Text>Grant: {name}</Text>
        <Text>Voter Address: {shortenAddress(voterAddress, 6)}</Text>
        <Text>Amount Voted: {totalVotes}</Text>
      </div>
    </Card>
  )
}

export const UserVotedGrants: React.FC = () => {
  const { data: userByWallet } = useUserByWalletQuery()

  const { openModal } = useModal()

  return (
    <div className={'user-voted-grants'}>
      <Flex alignItemsCenter style={{ marginBottom: '24px' }}>
        <Text bold important fontSize={'28px'} color={'primary'} mr={'16px'}>
          Your voted grants
        </Text>
        <Button scale={'sm'} variant={'subtle'} onClick={() => openModal(<AllGrantsDialog />)}>
          ＋ Register a new one
        </Button>
      </Flex>

      <div style={{ display: 'grid', rowGap: '24px' }}>
        {
          userByWallet?.grants.map(grant => (<VotedGrantCard {...grant} key={grant.key} />))
        }
      </div>
    </div>
  )
}
