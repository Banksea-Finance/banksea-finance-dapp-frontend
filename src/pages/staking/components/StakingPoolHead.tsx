import Flex from '@react-css/flex'
import { Card, Text } from '@/contexts/theme/components'
import { ClipLoader } from 'react-spinners'
import { WalletRequiredButton } from '@/components/WalletRequiredButton'
import React from 'react'
import styled from 'styled-components'
import { UseQueryResult } from 'react-query'
import BigNumber from 'bignumber.js'

export type StakingPoolHeadProps = {
  name: string
  icon: string

  availableRewards: UseQueryResult<BigNumber | undefined>
  rewardTokenName: string
  onHarvest: () => void
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
  padding: 8px 32px;
  border-radius: 40px;
  
  .texts {
    display: flex;
    flex-direction: row;
    margin-right: 16px;
    column-gap: 8px;
    
    div {
      font-size: 18px;
    }
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 24px;
    margin: 0 auto;
    border-radius: 32px;
   
    .texts {
      flex-direction: column;
      align-items: center;

      div {
        font-size: 16px;
      }
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

const StakingPoolHead: React.FC<StakingPoolHeadProps> = ({ name, icon, availableRewards, rewardTokenName, onHarvest }) => {
  return (
    <StakingPoolHeadContainer>
      <Flex row alignItemsCenter className={'poolname'}>
        <PoolImage src={icon} />
        <PoolName bold>
          {name}
        </PoolName>
      </Flex>

      <RewardsCard plain backgroundColor={'secondary'}>
        <div className="texts">
          <Text bold color={'textContrary'}>
            {'Available rewards: '}
          </Text>
          <Text bold color={'textContrary'} >
            {availableRewards.data ? (
              `${availableRewards.data?.toFixed(6)} ${rewardTokenName}`
            ) : availableRewards.isFetching ? (
              <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
            ) : (
              '-'
            )}
          </Text>
        </div>
        <WalletRequiredButton scale={'M'} onClick={onHarvest} variant={'primaryContrary'}>
          Harvest
        </WalletRequiredButton>
      </RewardsCard>
    </StakingPoolHeadContainer>
  )
}

export { StakingPoolHead }
