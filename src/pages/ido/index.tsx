import React, { useState } from 'react'
import { useOwnedNFTsQuery } from '@/hooks/queries/useOwnedNFTsQuery'
import { useResponsive } from '@/contexts/theme'
import Flex from '@react-css/flex'
import { Card, Tabs, Text } from '@/contexts/theme/components'
import { CitizenOneCollectionCreator } from '@/utils/constants'
import DefaultPageContainer from '@/components/DefaultPageContainer'
import NFTsGridView from '@/components/NFTsGridView'
import { useCollectionStorage } from '@/hooks/programs/useCollectionStorage'
import { BN } from '@project-serum/anchor'
import moment from 'moment'

const BNTimeDataItem: React.FC<{ label: string, time?: BN }> = ({ label, time }) => {
  moment.locale('en')

  return (
    <Flex alignItemsCenter flexDirection={'column'}>
      <Text mr={'4px'} fontSize={'16px'} fontWeight={500} color={'textDisabled'}>
        {label}:
      </Text>
      <Text fontSize={'20px'} color={'primary'} bold textAlign={'end'}>
        {
          time ? (moment(time.toNumber() * 1000).format('LLL')) : '-'
        }
      </Text>
    </Flex>
  )
}

export const IdoPage: React.FC = () => {
  const holds = useOwnedNFTsQuery(CitizenOneCollectionCreator)
  const { deposit, withdraw, userDeposited, poolAccount } = useCollectionStorage()
  const [key, setKey] = useState('hold')
  const { isMobile } = useResponsive()

  return (
    <DefaultPageContainer>
      <Card width={'100%'} p={'16px 32px'}>
        <Text important bold fontSize={'32px' } color={'primary'}>IDO Whitelist Register</Text>

        <Flex justifySpaceBetween style={{ width: '80%', margin: '32px 0 32px 10%' }}>
          <BNTimeDataItem time={poolAccount?.depositStartTime} label={'Deposit Start Time'} />
          <BNTimeDataItem time={poolAccount?.depositEndTime} label={'Deposit End Time'} />
          <BNTimeDataItem time={poolAccount?.withdrawStartTime} label={'Withdraw Start Time'} />
        </Flex>

        <Tabs activeKey={key} onTabChange={setKey} width={'100%'} scale={isMobile ? 'xs' : 'sm'}>
          <Tabs.Pane title={'My Stake'} tabKey={'stake'}>
            <NFTsGridView
              queryResult={userDeposited}
              itemOperation={{
                text: 'Withdraw',
                callback: withdraw
              }}
            />
          </Tabs.Pane>

          <Tabs.Pane title={'My Hold'} tabKey={'hold'}>
            <NFTsGridView
              queryResult={holds}
              itemOperation={{
                text: 'Deposit',
                callback: deposit
              }}
            />
          </Tabs.Pane>
        </Tabs>
      </Card>
    </DefaultPageContainer>
  )
}
