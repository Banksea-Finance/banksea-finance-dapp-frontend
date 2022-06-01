import React from 'react'
import { Box, Flex, Text } from '@banksea-finance/ui-kit'
import styled, { CSSProperties } from 'styled-components'
import { QueriedData, QueriedDataProps } from '@/components/QueriedData'
import { QuestionMarkSvg } from '@/components/svgs'
import ReactTooltip from 'react-tooltip'

interface Props<T> extends QueriedDataProps<T> {
  type: 'NFT' | 'TOKEN'
  background: string
  icon: React.ReactNode
  description?: React.ReactNode
  label: React.ReactNode
  labelWidth?: CSSProperties['width']
}

const StatisticCardContainer = styled(Box)<{ $background: string }>`
  width: 100%;
  height: 200px;
  position: relative;
  border-radius: 20px;

  background-image: url('${props => props.$background}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.maxMd} {
    height: min(200px, ${(130 / 375) * 100}vw);
    min-height: 130px;
  }
`

const IconContainer = styled(Box)`
  position: absolute;

  right: 32px;
  top: 32px;

  ${({ theme }) => theme.mediaQueries.maxXl} {
    right: 16px;
    top: 16px;
  }

  ${({ theme }) => theme.mediaQueries.maxSm} {
    right: 8px;
    top: 8px;
  }
`

export function StatisticCard<T>({ label, value, displayFunction, icon: Icon, background, description, type }: Props<T>) {
  const tooltipId = `statistic-${type}-${label}`

  return (
    <StatisticCardContainer $background={background} p={{ lg: '24px 16px', _: '16px 8px' }}>
      <IconContainer>{Icon}</IconContainer>

      <Flex
        flexDirection={'column'}
        jc={{ xl: 'end', _: 'center' }}
        ai={{ xl: 'start', _: 'center' }}
        pt={{ xl: 'none', _: '15%' }}
        height={'100%'}
        width={'100%'}
      >
        <Flex ai={'center'}>
          <Text fontSize={{ lg: '16px', _: '14px' }} mr={{ _: '4px' }} textAlign={{ _: 'center' }}>
            {label}
          </Text>
          <a data-tip="true" data-for={tooltipId}>
            <QuestionMarkSvg color={'white'} />
          </a>
          <ReactTooltip id={tooltipId} aria-haspopup="true">
            <Text>{description}</Text>
          </ReactTooltip>
        </Flex>
        <QueriedData
          fontSize={{ md: 'max(min(30px, 2vw), 18px)', _: 'max(min(42px, 5.2vw), 18px)' }}
          value={value}
          displayFunction={displayFunction}
          bold
        />
      </Flex>
    </StatisticCardContainer>
  )
}
