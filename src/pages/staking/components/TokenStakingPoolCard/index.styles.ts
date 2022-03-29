import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'

export const StyledTokenStakingPoolCard = styled(Card)`
  width: 100%;
  padding: 24px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 12px;
    border-radius: 10px;
  }
`

export const CurrencyIconImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;

  & + & {
    margin-left: 10px;
  }
`

