import React from 'react'
import { UserVotedGrant, useUserByWalletQuery } from '@/hooks/queries/airdrop/useUserByWalletQuery'
import { Button, Card, Skeleton, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import { useModal } from '@/contexts'
import { AllGrantsDialog } from '@/pages/airdrop/components/AllGrantsDialog'
import { GrantInfo, GrantsInfoByKey } from '@/pages/airdrop/constant'
import BigNumber from 'bignumber.js'
import { shortenAddress } from '@/utils'

const VotedGrantCard: React.FC<GrantInfo & UserVotedGrant> = ({ image, name, vote, address }) => {
  return (
    <Card height={'128px'} p={'12px 8px'} display={'flex'} isActive>
      <img src={image} alt="" style={{ height: '100%', borderRadius: '32px', marginRight: '16px' }} />
      <div style={{ padding: '0', display: 'grid', rowGap: '8px', alignItems: 'center' }}>
        <Text>
          Grant: <b className="primary">{name}</b>
        </Text>
        <Text>
          Voter Address: <b className="primary">{shortenAddress(address, 6)}</b>
        </Text>
        <Text>
          You Voted: <b className="primary">{new BigNumber(vote).toString()}</b>
        </Text>
      </div>
    </Card>
  )
}

export const UserVotedGrants: React.FC = () => {
  const { data: userByWallet, isLoading } = useUserByWalletQuery()

  const { openModal } = useModal()

  return (
    <div className={'user-voted-grants'}>
      <Flex alignItemsCenter style={{ marginBottom: '24px' }}>
        <Text bold important fontSize={'28px'} color={'primary'} mr={'16px'}>
          Your voted grants
        </Text>
        <Button scale={'sm'} variant={'secondary'} onClick={() => openModal(<AllGrantsDialog />)}>
          ＋ Register a new one
        </Button>
      </Flex>

      <div style={{ display: 'grid', rowGap: '24px' }}>
        {
          isLoading
            ? new Array(3).fill(<Skeleton height={'128px'} width={'100%'} borderRadius={'32px'} />)
            : userByWallet?.builds?.map(grant => (<VotedGrantCard {...grant} {...GrantsInfoByKey[grant.grant]} key={grant.grant} />))
        }
      </div>
    </div>
  )
}
