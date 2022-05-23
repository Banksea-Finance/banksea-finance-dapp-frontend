import { Card, Flex, Grid, Text } from '@/contexts/theme/components'
import { WalletRequiredButton } from '@/components/WalletRequiredButton'
import React from 'react'
import styled from 'styled-components'
import { UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'
import QueriedData from '@/components/QueriedData'

export type StakingPoolHeadProps = {
  name: string
  icon: string

  availableRewards: UseQueryResult<BigNumber | undefined>
  rewardTokenName: string
  onHarvest: () => void
  onCompound?: () => void
}

const StakingPoolHeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    justify-content: start;
    align-items: start;
    
    .poolname {
      margin-bottom: 12px;
    }
  }
`

const RewardsCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 30px;
  border-radius: 28px;
  
  .texts {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
    column-gap: 8px;
    
    div {
      font-size: 16px;
    }
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 24px;
    margin: 0 auto;
    border-radius: 32px;
    flex-direction: column;

    .texts {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
  
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 4px 16px;
  }
`

const PoolName = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
  }
`

const PoolImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  
  margin-right: 16px;
  
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 8px;
    width: 36px;
    height: 36px;
  }
`

const StakingPoolHead: React.FC<StakingPoolHeadProps> = ({ name, icon, availableRewards, rewardTokenName, onHarvest, onCompound }) => {
  return (
    <StakingPoolHeadContainer>
      <Flex ai={'center'} className={'poolname'}>
        <PoolImage src={icon} />
        <PoolName bold color={'primary'}>{name}</PoolName>
      </Flex>

      <RewardsCard plain>
        <div className="texts">
          <Text color={'primary'}>
            {'Available rewards: '}
          </Text>
          <QueriedData
            color={'textContrary'}
            value={availableRewards}
            displayFunction={v => `${v.toFixed(6)} ${rewardTokenName}`}
          />
        </div>
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
      </RewardsCard>
    </StakingPoolHeadContainer>
  )
}

export { StakingPoolHead }
