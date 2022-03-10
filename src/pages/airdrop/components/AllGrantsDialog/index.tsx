import React from 'react'
import { Card, Text } from '@/contexts/theme/components'
import { Grid } from '@react-css/grid'
import { useUserByWalletQuery } from '@/hooks/queries/useUserByWalletQuery'
import { Flex } from '@react-css/flex'
import { CardRibbon } from '@/contexts/theme/components/Card'
import { useModal } from '@/contexts'
import { RegisterGrantDialog } from '@/pages/airdrop/components/RegisterGrantDialog'
import { SupportedChainIds } from '@/hooks/useMultiChainsWeb3'

export type Grant = {
  key: string
  name: string
  chainId: SupportedChainIds
  image: string
}

const ALL_GRANTS: Grant[] = [
  /* {
    key: 'solana-1',
    name: 'Solana Grant',
    chain: 'SOLANA',
    image: 'https://hackerlink.s3.amazonaws.com/static/files/Solana1_GKLekgH.jpg',
  },
  {
    key: 'solana-2',
    name: 'Solana Ignition Hackathon Round-2',
    chain: 'SOLANA',
    image: 'https://hackerlink.s3.amazonaws.com/static/files/Solana2_eJt96fb.jpg',
  },*/
  {
    key: 'polygon',
    name: 'Polygon-Grants Hackathon Round-1',
    chainId: 137,
    image: require('@/assets/images/grants/polygon.png')
  },
  {
    key: 'filecoin',
    name: 'Filecoin Grant',
    chainId: 56,
    image: require('@/assets/images/grants/filecoin.png')
  },
  {
    key: 'okexchain',
    name: 'OKExChain Grant',
    chainId: 66,
    image: require('@/assets/images/grants/okexchain.png')
  },
]

const GrantCard: React.FC<Grant & { registered?: boolean }> = props => {
  const { name, image, registered } = props

  const { openModal } = useModal()

  return (
    <Card
      onClick={() => openModal(<RegisterGrantDialog {...props} />)}
      p={'0 0 4px 0'}
      ribbon={registered ? <CardRibbon text={'Registered'} textStyle={{ fontSize: '18px', bold: true }} /> : undefined}
      isActive={registered}
      activeOnHover
      style={{ cursor: 'pointer' }}
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
        {
          ALL_GRANTS.map(grant => (
            <GrantCard
              {...grant}
              registered={userByWallet?.grants.map(g => g.key).includes(grant.key)}
              key={grant.key}
            />
          ))
        }
      </Grid>
    </Card>
  )
}
