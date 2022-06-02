import { Box, Card, Flex, Grid, Tag, Text } from '@banksea-finance/ui-kit'
import { WalletRequiredButton } from '@/components/WalletRequiredButton'
import React from 'react'
import styled from 'styled-components'
import { UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'
import { QueriedData } from '@/components/QueriedData'
import dayjs from 'dayjs'
import { QuestionMarkSvg } from '@/components/svgs'
import ReactTooltip from 'react-tooltip'

export type StakingPoolHeadProps = {
  name: string
  icon: string
  description?: React.ReactNode

  availableRewards: UseQueryResult<BigNumber | undefined>
  rewardTokenName: string
  onHarvest: () => void
  onCompound?: () => void

  endTime?: number
  ended: boolean
}

const PoolImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  
  margin-right: 16px;
  
  ${({ theme }) => theme.mediaQueries.maxMd} {
    margin-right: 8px;
    width: 36px;
    height: 36px;
  }
`

export const StakingPoolHead: React.FC<StakingPoolHeadProps> = ({
  name, icon, availableRewards, rewardTokenName, onHarvest, onCompound, endTime, description, ended
}) => {
  return (
    <Flex
      flexDirection={'column'}
      ai={'center'}
      width={'100%'}
      mb={{ _: '32px' }}
    >
      <Flex
        jc={{ _: 'start', md: 'space-between' }}
        flexDirection={{ _: 'column', md: 'row' }}
        ai={{ _: 'start', md: 'center' }}
        width={'100%'}
      >
        <Flex ai={'center'} mb={{ _: '8px', md: '0' }} >
          <PoolImage src={icon} />

          <Text
            bold
            gradient
            important
            fontSize={{ lg: '36px', _: 'max(22px, 4vw)' }}
            mr={'8px'}
          >
            {name}
          </Text>

          {
            description && (
              <>
                <Box data-tip="true" data-for={name}>
                  <QuestionMarkSvg color={'#aaa'} />
                </Box>
                <ReactTooltip id={name} aria-haspopup="true">
                  <Text>{description}</Text>
                </ReactTooltip>
              </>
            )
          }
        </Flex>

        <Flex jc={{ _: 'center', md: 'end' }} width={{ _: '100%', md: 'fit-content' }}>
          <Card plain>
            <Flex
              ai={'center'}
              p={{ md: '6px 6px 6px 30px', _: '4px 18px' }}
              borderRadius={{ md: '28px', _: '32px' }}
              flexDirection={{ _: 'column', md: 'row' }}
            >
              <Flex ai={'center'} mr={{ md: '16px', _: '0' }} gap={'0 8px'} mb={{ _: '8px', md: '0' }}>
                <Text color={'primary'}>
                  {'Available rewards: '}
                </Text>
                <QueriedData
                  color={'textContrary'}
                  value={availableRewards}
                  displayFunction={v => `${v.toFixed(6)} ${rewardTokenName}`}
                />
              </Flex>
              <Grid gridGap={'8px'} gridTemplateColumns={`repeat(${onCompound ? '2' : '1'}, max-content)`}>
                <WalletRequiredButton plain circle scale={'S'} onClick={onHarvest} variant={'primary'}>
                  Harvest
                </WalletRequiredButton>
                {onCompound && (
                  <WalletRequiredButton plain circle scale={'S'} onClick={onCompound} variant={'primary'}>
                    Compound
                  </WalletRequiredButton>
                )}
              </Grid>
            </Flex>
          </Card>
        </Flex>
      </Flex>

      {
        !!endTime && (
          <Tag gradient={!ended || undefined} variant={ended ? 'warning' : undefined} scale={'S'} ml={'8px'} mt={{ _: '8px' }}>
            {
              ended
                ? 'Staking has ended'
                : `Ending time: ${dayjs.unix(endTime).format('lll')}`
            }
          </Tag>
        )
      }
    </Flex>
  )
}
